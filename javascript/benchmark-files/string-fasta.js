// The Great Computer Language Shootout
//  http://shootout.alioth.debian.org
//
//  Contributed by Ian Osgood

var last = 42, A = 3877, C = 29573, M = 139968;

function rand(max) {
  last = (last * A + C) % M;
  return max * last / M;
}

var ALU =
  "GGCCGGGCGCGGTGGCTCACGCCTGTAATCCCAGCACTTTGG" +
  "GAGGCCGAGGCGGGCGGATCACCTGAGGTCAGGAGTTCGAGA" +
  "CCAGCCTGGCCAACATGGTGAAACCCCGTCTCTACTAAAAAT" +
  "ACAAAAATTAGCCGGGCGTGGTGGCGCGCGCCTGTAATCCCA" +
  "GCTACTCGGGAGGCTGAGGCAGGAGAATCGCTTGAACCCGGG" +
  "AGGCGGAGGTTGCAGTGAGCCGAGATCGCGCCACTGCACTCC" +
  "AGCCTGGGCGACAGAGCGAGACTCCGTCTCAAAAA";

var IUB = {
  a:0.27, c:0.12, g:0.12, t:0.27,
  B:0.02, D:0.02, H:0.02, K:0.02,
  M:0.02, N:0.02, R:0.02, S:0.02,
  V:0.02, W:0.02, Y:0.02
}

var HomoSap = {
  a: 0.3029549426680,
  c: 0.1979883004921,
  g: 0.1975473066391,
  t: 0.3015094502008
}

function makeCumulative(table) {
  var last = null;
  for (var c in table) {
    if (last) table[c] += table[last];
    last = c;
  }
}

function fastaRepeat(n, seq) {
  var seqi = 0, lenOut = 60;
  while (n>0) {
    if (n<lenOut) lenOut = n;
    if (seqi + lenOut < seq.length) {
      ret += seq.substring(seqi, seqi+lenOut).length;
      seqi += lenOut;
    } else {
      var s = seq.substring(seqi);
      seqi = lenOut - s.length;
      ret += (s + seq.substring(0, seqi)).length;
    }
    n -= lenOut;
  }
}

function fastaRandom(n, table) {
  var line = new Array(60);
  makeCumulative(table);
  while (n>0) {
    if (n<line.length) line = new Array(n);
    for (var i=0; i<line.length; i++) {
      var r = rand(1);
      for (var c in table) {
        if (r < table[c]) {
          line[i] = c;
          break;
        }
      }
    }
    ret += line.join('').length;
    n -= line.length;
  }
}

for (let i = 0; i < 500; i++) {
  var ret = 0;

  var count = 7;
  fastaRepeat(2*count*100000, ALU);
  fastaRandom(3*count*1000, IUB);
  fastaRandom(5*count*1000, HomoSap);

  var expected = 1456000;

  if (ret != expected)
    throw "ERROR: bad result: expected " + expected + " but got " + ret;
}
