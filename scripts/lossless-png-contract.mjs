/** Narrow certificate for lossless IDAT changes; never relaxes geometry/material checks. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {inflateSync} from 'node:zlib';
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
export const pngEquivalence = JSON.parse(fs.readFileSync(new URL('../recovery/lossless-png-equivalence.json', import.meta.url)));
export function decodeRGB8PNG(bytes) {
 assert.ok(bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])), 'PNG signature');
 const other=[], idat=[]; let header, ended=false;
 for(let offset=8;offset<bytes.length;){
  assert.ok(offset+12<=bytes.length,'PNG chunk header');
  const size=bytes.readUInt32BE(offset),end=offset+size+12;
  assert.ok(end<=bytes.length,'PNG chunk length');
  const chunk=bytes.subarray(offset,end),kind=chunk.toString('ascii',4,8);
  if(kind==='IDAT')idat.push(chunk.subarray(8,-4));else other.push(chunk);
  if(offset===8){assert.equal(kind,'IHDR');assert.equal(size,13);header=chunk.subarray(8,-4);}
  if(kind==='IEND'){assert.equal(end,bytes.length);ended=true;}
  offset=end;
 }
 assert.ok(ended&&header&&idat.length,'Complete PNG required');
 assert.ok(header.subarray(8).equals(Buffer.from([8,2,0,0,0])),'Only noninterlaced RGB8 is certified');
 const width=header.readUInt32BE(0),height=header.readUInt32BE(4),stride=width*3;
 assert.ok(width>0&&height>0&&width<=8192&&height<=8192,'Bounded PNG dimensions');
 const filtered=inflateSync(Buffer.concat(idat),{maxOutputLength:(stride+1)*height});
 assert.equal(filtered.length,(stride+1)*height,'PNG row length');
 const pixels=Buffer.alloc(stride*height);
 const paeth=(a,b,c)=>{const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c;};
 for(let y=0;y<height;y++){
  const filter=filtered[y*(stride+1)];assert.ok(filter<=4,'PNG row filter');
  for(let x=0;x<stride;x++){
   const index=y*stride+x,left=x>=3?pixels[index-3]:0,up=y?pixels[index-stride]:0,corner=y&&x>=3?pixels[index-stride-3]:0;
   const predictor=filter===0?0:filter===1?left:filter===2?up:filter===3?Math.floor((left+up)/2):paeth(left,up,corner);
   pixels[index]=(filtered[y*(stride+1)+1+x]+predictor)&255;
  }
 }
 return {width,height,bitDepth:8,colorType:2,decodedChannelSha256:sha(pixels),nonIdatChunksSha256:sha(Buffer.concat(other))};
}
export function certifiedOriginalImageHash(bytes) {
 const hash=sha(bytes),entry=pngEquivalence.images.find(image=>image.afterSha256===hash);
 if(!entry)return hash;
 assert.equal(bytes.length,entry.afterBytes,'Certified PNG length');
 const decoded=decodeRGB8PNG(bytes);
 for(const key of Object.keys(decoded))assert.equal(decoded[key],entry[key],`Lossless PNG ${entry.name}: ${key}`);
 return entry.beforeSha256;
}
