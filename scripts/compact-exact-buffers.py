#!/usr/bin/env python3
"""Drop unreachable buffers and share byte-identical live buffer views only.
No decoded vertex, normal, UV, color, index, image or material changes.
"""
import copy, gzip, hashlib, json, pathlib, struct, sys

def sha(data): return hashlib.sha256(data).hexdigest()
def read(path):
    data=pathlib.Path(path).read_bytes()
    if data[:2]==b'\x1f\x8b': data=gzip.decompress(data)
    size=struct.unpack_from('<I',data,12)[0]
    return data,json.loads(data[20:20+size]),data[28+size:]
def walk(value, fn):
    if isinstance(value,dict):
        for key,item in value.items():
            if key=='bufferView': fn(value,key,item)
            else: walk(item,fn)
    elif isinstance(value,list):
        for item in value: walk(item,fn)
def semantic_json(data,binary):
    result=copy.deepcopy(data)
    def resolve(parent,key,index):
        view=data['bufferViews'][index];start=view.get('byteOffset',0)
        parent[key]={'viewMetadata':{k:v for k,v in view.items() if k not in ('byteOffset','buffer')},'sha256':sha(binary[start:start+view['byteLength']])}
    walk(result,resolve)
    result.pop('buffers',None);result.pop('bufferViews',None)
    return result
src,dst=sys.argv[1:3]
old,j,b=read(src);expected=semantic_json(j,b);active=set();walk(j,lambda parent,key,index:active.add(index))
views=[];chunks=[];mapping={};seen={};offset=0;duplicate=[]
for index in sorted(active):
    view=j['bufferViews'][index];start=view.get('byteOffset',0);raw=b[start:start+view['byteLength']]
    metadata={k:v for k,v in view.items() if k not in ('byteOffset','buffer')}
    key=(json.dumps(metadata,sort_keys=True),sha(raw))
    if key in seen:
        mapping[index]=seen[key];duplicate.append({'originalBufferView':index,'sharedBufferView':mapping[index],'bytes':len(raw)});continue
    pad=(-offset)%4;chunks.append(b'\x00'*pad);offset+=pad
    mapping[index]=len(views);seen[key]=len(views)
    views.append({**metadata,'buffer':0,'byteOffset':offset});chunks.append(raw);offset+=len(raw)
walk(j,lambda parent,key,index:parent.__setitem__(key,mapping[index]));j['bufferViews']=views;j['buffers']=[{'byteLength':offset}]
text=json.dumps(j,separators=(',',':')).encode();text+=b' '*((-len(text))%4)
binary=b''.join(chunks);binary+=b'\0'*((-len(binary))%4)
result=struct.pack('<III',0x46546c67,2,28+len(text)+len(binary))+struct.pack('<II',len(text),0x4e4f534a)+text+struct.pack('<II',len(binary),0x004e4942)+binary
assert semantic_json(j,binary)==expected,'Resolved accessor/image/material semantics changed'
pathlib.Path(dst).write_bytes(result)
_,verify,verify_binary=read(dst);assert semantic_json(verify,verify_binary)==expected
report={'operation':'Drop unreachable buffer views and share exact byte-identical payloads only','inputSha256':sha(old),'outputSha256':sha(result),'oldBytes':len(old),'newBytes':len(result),'savedBytes':len(old)-len(result),'oldBufferViewCount':len(read(src)[1]['bufferViews']),'liveInputBufferViews':len(active),'newBufferViewCount':len(views),'duplicateViews':duplicate,'resolvedAccessorsImagesAndAllOtherJSONUnchanged':True}
pathlib.Path(dst+'.buffers.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({k:v for k,v in report.items() if k!='duplicateViews'},indent=2))
