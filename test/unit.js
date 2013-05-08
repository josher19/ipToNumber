/** Tested with Mocha Framework http://github.com/visionmedia/mocha */
var assert = require('assert');
var ip2n = require('../ipToNumber');

// startup, could put in beforeEach
var new_ip=3661254138
var ip = "218.58.77.250";

describe('describe it works:', function() {
   it('can assert', function() {
      assert(assert, 'assert undefined!');
      assert(true, 'not true');
      assert(1, 'not 1');
      assert("hello", 'not 1');
      assert.equal(1, 1);
   });
   it('can catch throw exceptions', function() {
      assert.throws(function() { assert(0, 'zero'); });
      // assert.throws(function() { assert(1, 'one'); });
      assert.throws(function() { assert("", 'blank'); });
   });
});

describe('convert ip number ' + ip, function() {
  it('get digits', function() {
      var digits = ip2n.getDigits(ip); // ip.split(".").map(function(a) { return +a })
      assert(digits, "No digits " + digits);
      assert(digits.length === 4, "Digits length should be 4, was: " + digits.length);
      assert(digits[0] === 218, digits[0] + " !== " + 218);
      assert(digits[1] ===  58, digits[1] + " !== " +  58);
      assert(digits[2] ===  77, digits[2] + " !== " +  77);
      assert(digits[3] === 250, digits[3] + " !== " + 250);
  });
});

/**
 * Test IP conversion
 * new_ip : number Ex: 0xff0f0a01
 * ip : string Ex: "255.15.10.1"
 * iplist : Array Ex: [255,15,10,1] (optional)
 */
function testip(new_ip, ip, iplist) {
    if (!iplist) {
        if (ip.split) { 
            iplist = ip.split(".").map(function(a) { return +a; });
        } else if (ip.join) {
            iplist = ip; 
            ip = ip.join(".");
        }
    }
    describe('test ip', function() {
       it('> 0', function() {
          assert(new_ip > 0, 'negative ' + new_ip);
       });
       it('more than 24 bits', function() {
          var ipBinary = new_ip.toString(2), len = ipBinary.length;
          assert(len > 24, 'not enough bits ' + [len, ipBinary]);
       });
    });

    describe('convert ip number ' + ip, function() {
      it('get digits', function() {
          var digits = ip2n.getDigits(ip); // ip.split(".").map(function(a) { return +a })
          assert.equal(digits.length, iplist.length);
          assert.equal(digits.length, 4);
          assert.equal(digits[0], iplist[0]);
          assert.equal(digits[1], iplist[1]);
          assert.equal(digits[2], iplist[2]);
          assert.equal(digits[3], iplist[3]);
      });

      it('get numeric value from digits', function() {
          var digits = ip2n.getDigits(ip); // ip.split(".").map(function(a) { return +a })
          var t= ip2n.getNumber(digits); // digits[3] + (digits[2]<<8) + (digits[1]<<16) + digits[0]*Math.pow(2,24)
          assert(new_ip == t, t + " !== " + new_ip);
      }); 

      it('get numeric value from string', function() {
          var t = ip2n.getNumber(ip); // digits[3] + (digits[2]<<8) + (digits[1]<<16) + digits[0]*Math.pow(2,24)
          assert(new_ip == t, t + " !== " + new_ip);
      });

      it('get binary string', function() {		
          // function pad0(str,len,zero) { zero=zero||'0';if (null==len) len=8; while (str.length < len) str = zero + str; return str; }
          var binary = ip2n.getBinary(ip); // ip2n.getDigits(ip).map(function(a) { return pad0(a.toString(2)) }).join('');
          var new_ip_binary = new_ip.toString(2);
          assert(binary === new_ip_binary, binary + " !== " + new_ip_binary);
      });
    });

    describe('convert from number', function() {
      it('to IP string', function() {
          var ipstr = ip2n.fromNumber(new_ip);
          assert(ipstr == ip, ipstr + " !== " + ip);
      });
    });
    
    describe('convert from Array of Strings', function() {
        it('to number', function() {
            assert.equal(ip2n.getNumber(ip.split('.')), new_ip);
            assert.equal(ip2n.getBinary(ip.split('.')), ip2n.getBinary(new_ip));            
        });
    });
}

testip(new_ip, ip, [218,58,77,250]);
testip(167772161, "10.0.0.1", [10,0,0,1]);
testip(0x0A000001, "10.0.0.1", [10,0,0,1]);
testip(167838211, "10.1.2.3", [10,1,2,3]);
testip(1123619027, "66.249.16.211", [66,249,16,211]);
testip(0xffffffff, "255.255.255.255");
testip(0xff0f0a01, [255,15,10,1]);
testip(0x01020304, [1,2,3,4]);
testip(16909060, "1.2.3.4");

describe('Check from number', function() {
    it('should fail', function() { 
        assert.throws(function() { 
            assert.equal(ip2n.fromNumber(0xffffff00), "255.255.255.1");
        });
    })
    it('should not fail', function() { 
        assert.equal(ip2n.fromNumber(0xffffff00), "255.255.255.0");
    })
    it('should get binary', function() {
        assert.equal(ip2n.getBinary(ip2n.fromNumber(0xffffff00)), (0xffffff00).toString(2));
        assert.equal(ip2n.getBinary("255.255.255.0"), "11111111111111111111111100000000");
        assert.equal(ip2n.getBinary("255.64.253.1"),  "11111111010000001111110100000001");
    });
    
    it('should get binary from string or Array', function() {
        assert.equal(ip2n.getBinary("1.2.3.4").length, 25);
        assert.equal(ip2n.getBinary([1,2,3,4]).length, 25);        
        assert.equal(ip2n.getBinary([4,3,2,255]), ip2n.getBinary("4.3.2.255"));
    });
    
    it('should get binary from string or Number', function() {
        assert.equal(ip2n.getBinary("1.2.3.4"), "1000000100000001100000100");
        assert.equal(ip2n.getBinary(0x1020304), "1000000100000001100000100");
        assert.equal( ip2n.getBinary(ip2n.getNumber('1.2.3.4'.split('.'))), ip2n.getBinary(0x1020304));
    });
});

describe('final check', function() {
    it('variables not changed', function() {
		assert.equal(ip, "218.58.77.250");
		assert.equal(new_ip, 3661254138);
	});
    it('fromNumber', function() {
        assert.equal(ip2n.fromNumber(16909060), '1.2.3.4');
        assert.equal(ip2n.fromNumber(0x01020304), '1.2.3.4');
        assert.equal(ip2n.fromNumber('16909060'), '1.2.3.4');
    });
    it('getDigits', function() {
        assert.deepEqual(ip2n.getDigits("1.2.3.4"), [1,2,3,4]);
        assert.deepEqual(ip2n.getDigits("1.2.3.4".split(".")), [1,2,3,4]);
    });
    it('getNumber', function() {
        assert.equal(ip2n.getNumber('1.2.3.4'), 0x01020304);
        assert.equal(ip2n.getNumber([1,2,3,4]), 0x01020304);
    });
    it('getBinary', function() {
        assert.equal(ip2n.getBinary("1.2.3.4"), "1000000100000001100000100");
        assert.equal(ip2n.getBinary([1,2,3,4]), "1000000100000001100000100");
        assert.equal(ip2n.getBinary(0x1020304), "1000000100000001100000100");
        assert.equal(ip2n.getBinary(16909060),  "1000000100000001100000100");
    });
});
