// ── Configuration ──────────────────────────────────────────────
// IMPORTANT : mets à jour cette URL à chaque redémarrage de ngrok
const API_URL = 'https://cartoon-revoke-music.ngrok-free.dev/api';

Office.actions.associate("onNewMessageComposeHandler", onNewMessageComposeHandler);
Office.actions.associate("onNewAppointmentComposeHandler", onNewAppointmentComposeHandler);

function getPublicAssetUrl(fileName) {
  const base = new URL('../', window.location.href);
  return new URL(fileName, base).href;
}

function normalizeTemplateAssets(html) {
  if (!html) return html;
  const logoUrl = getPublicAssetUrl('timsoft-logo.png');
  return html.replace(/src=(['"])(?:\.\.\/|\.\/|\/)?timsoft-logo\.png\1/gi, 'src="' + logoUrl + '"');
}

// ── Générateur de QR code réel (bibliothèque qrcode-generator, domaine public) ──
// qrcode-generator (Kazuhiko Arase) — domaine public / MIT
// Bibliothèque QR pure JS, sans dépendance, intégrable directement.
var qrcode = (function() {
  var qrcode = function(typeNumber, errorCorrectionLevel) {
    var PAD0 = 0xEC, PAD1 = 0x11;
    var _typeNumber = typeNumber;
    var _errorCorrectionLevel = QRErrorCorrectionLevel[errorCorrectionLevel];
    var _modules = null, _moduleCount = 0, _dataCache = null, _dataList = [];
    var _this = {};

    var makeImpl = function(test, maskPattern) {
      _moduleCount = _typeNumber * 4 + 17;
      _modules = function(moduleCount) {
        var modules = new Array(moduleCount);
        for (var row = 0; row < moduleCount; row += 1) {
          modules[row] = new Array(moduleCount);
          for (var col = 0; col < moduleCount; col += 1) modules[row][col] = null;
        }
        return modules;
      }(_moduleCount);
      setupPositionProbePattern(0, 0);
      setupPositionProbePattern(_moduleCount - 7, 0);
      setupPositionProbePattern(0, _moduleCount - 7);
      setupPositionAdjustPattern();
      setupTimingPattern();
      setupTypeInfo(test, maskPattern);
      if (_typeNumber >= 7) setupTypeNumber(test);
      if (_dataCache == null) _dataCache = createData(_typeNumber, _errorCorrectionLevel, _dataList);
      mapData(_dataCache, maskPattern);
    };

    var setupPositionProbePattern = function(row, col) {
      for (var r = -1; r <= 7; r += 1) {
        if (row + r <= -1 || _moduleCount <= row + r) continue;
        for (var c = -1; c <= 7; c += 1) {
          if (col + c <= -1 || _moduleCount <= col + c) continue;
          if ((0 <= r && r <= 6 && (c == 0 || c == 6)) ||
              (0 <= c && c <= 6 && (r == 0 || r == 6)) ||
              (2 <= r && r <= 4 && 2 <= c && c <= 4)) {
            _modules[row + r][col + c] = true;
          } else {
            _modules[row + r][col + c] = false;
          }
        }
      }
    };

    var getBestMaskPattern = function() {
      var minLostPoint = 0, pattern = 0;
      for (var i = 0; i < 8; i += 1) {
        makeImpl(true, i);
        var lostPoint = QRUtil.getLostPoint(_this);
        if (i == 0 || minLostPoint > lostPoint) { minLostPoint = lostPoint; pattern = i; }
      }
      return pattern;
    };

    var setupTimingPattern = function() {
      for (var r = 8; r < _moduleCount - 8; r += 1) {
        if (_modules[r][6] != null) continue;
        _modules[r][6] = (r % 2 == 0);
      }
      for (var c = 8; c < _moduleCount - 8; c += 1) {
        if (_modules[6][c] != null) continue;
        _modules[6][c] = (c % 2 == 0);
      }
    };

    var setupPositionAdjustPattern = function() {
      var pos = QRUtil.getPatternPosition(_typeNumber);
      for (var i = 0; i < pos.length; i += 1) {
        for (var j = 0; j < pos.length; j += 1) {
          var row = pos[i], col = pos[j];
          if (_modules[row][col] != null) continue;
          for (var r = -2; r <= 2; r += 1) {
            for (var c = -2; c <= 2; c += 1) {
              if (r == -2 || r == 2 || c == -2 || c == 2 || (r == 0 && c == 0)) {
                _modules[row + r][col + c] = true;
              } else {
                _modules[row + r][col + c] = false;
              }
            }
          }
        }
      }
    };

    var setupTypeNumber = function(test) {
      var bits = QRUtil.getBCHTypeNumber(_typeNumber);
      for (var i = 0; i < 18; i += 1) {
        var mod = (!test && ((bits >> i) & 1) == 1);
        _modules[Math.floor(i / 3)][i % 3 + _moduleCount - 8 - 3] = mod;
      }
      for (var i = 0; i < 18; i += 1) {
        var mod = (!test && ((bits >> i) & 1) == 1);
        _modules[i % 3 + _moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
      }
    };

    var setupTypeInfo = function(test, maskPattern) {
      var data = (_errorCorrectionLevel << 3) | maskPattern;
      var bits = QRUtil.getBCHTypeInfo(data);
      for (var i = 0; i < 15; i += 1) {
        var mod = (!test && ((bits >> i) & 1) == 1);
        if (i < 6) _modules[i][8] = mod;
        else if (i < 8) _modules[i + 1][8] = mod;
        else _modules[_moduleCount - 15 + i][8] = mod;
      }
      for (var i = 0; i < 15; i += 1) {
        var mod = (!test && ((bits >> i) & 1) == 1);
        if (i < 8) _modules[8][_moduleCount - i - 1] = mod;
        else if (i < 9) _modules[8][15 - i - 1 + 1] = mod;
        else _modules[8][15 - i - 1] = mod;
      }
      _modules[_moduleCount - 8][8] = (!test);
    };

    var mapData = function(data, maskPattern) {
      var inc = -1, row = _moduleCount - 1, bitIndex = 7, byteIndex = 0;
      var maskFunc = QRUtil.getMaskFunction(maskPattern);
      for (var col = _moduleCount - 1; col > 0; col -= 2) {
        if (col == 6) col -= 1;
        while (true) {
          for (var c = 0; c < 2; c += 1) {
            if (_modules[row][col - c] == null) {
              var dark = false;
              if (byteIndex < data.length) dark = (((data[byteIndex] >>> bitIndex) & 1) == 1);
              var mask = maskFunc(row, col - c);
              if (mask) dark = !dark;
              _modules[row][col - c] = dark;
              bitIndex -= 1;
              if (bitIndex == -1) { byteIndex += 1; bitIndex = 7; }
            }
          }
          row += inc;
          if (row < 0 || _moduleCount <= row) { row -= inc; inc = -inc; break; }
        }
      }
    };

    var createBytes = function(buffer, rsBlocks) {
      var offset = 0, maxDcCount = 0, maxEcCount = 0;
      var dcdata = new Array(rsBlocks.length), ecdata = new Array(rsBlocks.length);
      for (var r = 0; r < rsBlocks.length; r += 1) {
        var dcCount = rsBlocks[r].dataCount, ecCount = rsBlocks[r].totalCount - dcCount;
        maxDcCount = Math.max(maxDcCount, dcCount);
        maxEcCount = Math.max(maxEcCount, ecCount);
        dcdata[r] = new Array(dcCount);
        for (var i = 0; i < dcdata[r].length; i += 1) dcdata[r][i] = 0xff & buffer.getBuffer()[i + offset];
        offset += dcCount;
        var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
        var rawPoly = qrPolynomial(dcdata[r], rsPoly.getLength() - 1);
        var modPoly = rawPoly.mod(rsPoly);
        ecdata[r] = new Array(rsPoly.getLength() - 1);
        for (var i = 0; i < ecdata[r].length; i += 1) {
          var modIndex = i + modPoly.getLength() - ecdata[r].length;
          ecdata[r][i] = (modIndex >= 0) ? modPoly.getAt(modIndex) : 0;
        }
      }
      var totalCodeCount = 0;
      for (var i = 0; i < rsBlocks.length; i += 1) totalCodeCount += rsBlocks[i].totalCount;
      var data = new Array(totalCodeCount), index = 0;
      for (var i = 0; i < maxDcCount; i += 1)
        for (var r = 0; r < rsBlocks.length; r += 1)
          if (i < dcdata[r].length) data[index++] = dcdata[r][i];
      for (var i = 0; i < maxEcCount; i += 1)
        for (var r = 0; r < rsBlocks.length; r += 1)
          if (i < ecdata[r].length) data[index++] = ecdata[r][i];
      return data;
    };

    var createData = function(typeNumber, errorCorrectionLevel, dataList) {
      var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectionLevel);
      var buffer = qrBitBuffer();
      for (var i = 0; i < dataList.length; i += 1) {
        var data = dataList[i];
        buffer.put(data.getMode(), 4);
        buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber));
        data.write(buffer);
      }
      var totalDataCount = 0;
      for (var i = 0; i < rsBlocks.length; i += 1) totalDataCount += rsBlocks[i].dataCount;
      if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) buffer.put(0, 4);
      while (buffer.getLengthInBits() % 8 != 0) buffer.putBit(false);
      while (true) {
        if (buffer.getLengthInBits() >= totalDataCount * 8) break;
        buffer.put(PAD0, 8);
        if (buffer.getLengthInBits() >= totalDataCount * 8) break;
        buffer.put(PAD1, 8);
      }
      return createBytes(buffer, rsBlocks);
    };

    _this.addData = function(data) {
      var newData = qr8BitByte(data);
      _dataList.push(newData);
      _dataCache = null;
    };
    _this.isDark = function(row, col) {
      if (row < 0 || _moduleCount <= row || col < 0 || _moduleCount <= col) throw new Error(row + "," + col);
      return _modules[row][col];
    };
    _this.getModuleCount = function() { return _moduleCount; };
    _this.make = function() {
      if (_typeNumber < 1) {
        var typeNumber = 1;
        for (; typeNumber < 40; typeNumber++) {
          var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, _errorCorrectionLevel);
          var buffer = qrBitBuffer();
          for (var i = 0; i < _dataList.length; i++) {
            var data = _dataList[i];
            buffer.put(data.getMode(), 4);
            buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber));
            data.write(buffer);
          }
          var totalDataCount = 0;
          for (var i = 0; i < rsBlocks.length; i++) totalDataCount += rsBlocks[i].dataCount;
          if (buffer.getLengthInBits() <= totalDataCount * 8) break;
        }
        _typeNumber = typeNumber;
      }
      makeImpl(false, getBestMaskPattern());
    };
    return _this;
  };

  qrcode.stringToBytes = function(s) {
    var bytes = [];
    var utf8 = unescape(encodeURIComponent(s));
    for (var i = 0; i < utf8.length; i++) bytes.push(utf8.charCodeAt(i));
    return bytes;
  };

  var QRMode = { MODE_8BIT_BYTE: 4 };
  var QRErrorCorrectionLevel = { L: 1, M: 0, Q: 3, H: 2 };
  var QRMaskPattern = {};
  var QRUtil = (function() {
    var PATTERN_POSITION_TABLE = [
      [], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42],
      [6, 26, 46], [6, 28, 50], [6, 30, 54], [6, 32, 58], [6, 34, 62], [6, 26, 46, 66],
      [6, 26, 48, 70], [6, 26, 50, 74], [6, 30, 54, 78], [6, 30, 56, 82], [6, 30, 58, 86],
      [6, 34, 62, 90], [6, 28, 50, 72, 94], [6, 26, 50, 74, 98], [6, 30, 54, 78, 102],
      [6, 28, 54, 80, 106], [6, 32, 58, 84, 110], [6, 30, 58, 86, 114], [6, 34, 62, 90, 118],
      [6, 26, 50, 74, 98, 122], [6, 30, 54, 78, 102, 126], [6, 26, 52, 78, 104, 130],
      [6, 30, 56, 82, 108, 134], [6, 34, 60, 86, 112, 138], [6, 30, 58, 86, 114, 142],
      [6, 34, 62, 90, 118, 146], [6, 30, 54, 78, 102, 126, 150], [6, 24, 50, 76, 102, 128, 154],
      [6, 28, 54, 80, 106, 132, 158], [6, 32, 58, 84, 110, 136, 162], [6, 26, 54, 82, 110, 138, 166],
      [6, 30, 58, 86, 114, 142, 170]
    ];
    var G15 = (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0);
    var G18 = (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0);
    var G15_MASK = (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1);
    var _this = {};
    var getBCHDigit = function(data) {
      var digit = 0;
      while (data != 0) { digit += 1; data >>>= 1; }
      return digit;
    };
    _this.getBCHTypeInfo = function(data) {
      var d = data << 10;
      while (getBCHDigit(d) - getBCHDigit(G15) >= 0) d ^= (G15 << (getBCHDigit(d) - getBCHDigit(G15)));
      return ((data << 10) | d) ^ G15_MASK;
    };
    _this.getBCHTypeNumber = function(data) {
      var d = data << 12;
      while (getBCHDigit(d) - getBCHDigit(G18) >= 0) d ^= (G18 << (getBCHDigit(d) - getBCHDigit(G18)));
      return (data << 12) | d;
    };
    _this.getPatternPosition = function(typeNumber) { return PATTERN_POSITION_TABLE[typeNumber - 1]; };
    _this.getMaskFunction = function(maskPattern) {
      switch (maskPattern) {
        case 0: return function(i, j) { return (i + j) % 2 == 0; };
        case 1: return function(i, j) { return i % 2 == 0; };
        case 2: return function(i, j) { return j % 3 == 0; };
        case 3: return function(i, j) { return (i + j) % 3 == 0; };
        case 4: return function(i, j) { return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 == 0; };
        case 5: return function(i, j) { return (i * j) % 2 + (i * j) % 3 == 0; };
        case 6: return function(i, j) { return ((i * j) % 2 + (i * j) % 3) % 2 == 0; };
        case 7: return function(i, j) { return ((i * j) % 3 + (i + j) % 2) % 2 == 0; };
        default: throw new Error("bad maskPattern:" + maskPattern);
      }
    };
    _this.getErrorCorrectPolynomial = function(errorCorrectLength) {
      var a = qrPolynomial([1], 0);
      for (var i = 0; i < errorCorrectLength; i += 1) a = a.multiply(qrPolynomial([1, QRMath.gexp(i)], 0));
      return a;
    };
    _this.getLengthInBits = function(mode, type) {
      if (1 <= type && type < 10) { switch (mode) { case QRMode.MODE_8BIT_BYTE: return 8; default: throw new Error("mode:" + mode); } }
      else if (type < 27) { switch (mode) { case QRMode.MODE_8BIT_BYTE: return 16; default: throw new Error("mode:" + mode); } }
      else if (type < 41) { switch (mode) { case QRMode.MODE_8BIT_BYTE: return 16; default: throw new Error("mode:" + mode); } }
      else throw new Error("type:" + type);
    };
    _this.getLostPoint = function(qrCode) {
      var moduleCount = qrCode.getModuleCount(), lostPoint = 0;
      for (var row = 0; row < moduleCount; row += 1) {
        for (var col = 0; col < moduleCount; col += 1) {
          var sameCount = 0, dark = qrCode.isDark(row, col);
          for (var r = -1; r <= 1; r += 1) {
            if (row + r < 0 || moduleCount <= row + r) continue;
            for (var c = -1; c <= 1; c += 1) {
              if (col + c < 0 || moduleCount <= col + c) continue;
              if (r == 0 && c == 0) continue;
              if (dark == qrCode.isDark(row + r, col + c)) sameCount += 1;
            }
          }
          if (sameCount > 5) lostPoint += (3 + sameCount - 5);
        }
      }
      for (var row = 0; row < moduleCount - 1; row += 1) {
        for (var col = 0; col < moduleCount - 1; col += 1) {
          var count = 0;
          if (qrCode.isDark(row, col)) count += 1;
          if (qrCode.isDark(row + 1, col)) count += 1;
          if (qrCode.isDark(row, col + 1)) count += 1;
          if (qrCode.isDark(row + 1, col + 1)) count += 1;
          if (count == 0 || count == 4) lostPoint += 3;
        }
      }
      for (var row = 0; row < moduleCount; row += 1) {
        for (var col = 0; col < moduleCount - 6; col += 1) {
          if (qrCode.isDark(row, col) && !qrCode.isDark(row, col + 1) && qrCode.isDark(row, col + 2) &&
              qrCode.isDark(row, col + 3) && qrCode.isDark(row, col + 4) && !qrCode.isDark(row, col + 5) && qrCode.isDark(row, col + 6)) {
            lostPoint += 40;
          }
        }
      }
      for (var col = 0; col < moduleCount; col += 1) {
        for (var row = 0; row < moduleCount - 6; row += 1) {
          if (qrCode.isDark(row, col) && !qrCode.isDark(row + 1, col) && qrCode.isDark(row + 2, col) &&
              qrCode.isDark(row + 3, col) && qrCode.isDark(row + 4, col) && !qrCode.isDark(row + 5, col) && qrCode.isDark(row + 6, col)) {
            lostPoint += 40;
          }
        }
      }
      var darkCount = 0;
      for (var col = 0; col < moduleCount; col += 1)
        for (var row = 0; row < moduleCount; row += 1)
          if (qrCode.isDark(row, col)) darkCount += 1;
      var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
      lostPoint += ratio * 10;
      return lostPoint;
    };
    return _this;
  })();

  var QRMath = (function() {
    var EXP_TABLE = new Array(256), LOG_TABLE = new Array(256);
    for (var i = 0; i < 8; i += 1) EXP_TABLE[i] = 1 << i;
    for (var i = 8; i < 256; i += 1) EXP_TABLE[i] = EXP_TABLE[i - 4] ^ EXP_TABLE[i - 5] ^ EXP_TABLE[i - 6] ^ EXP_TABLE[i - 8];
    for (var i = 0; i < 255; i += 1) LOG_TABLE[EXP_TABLE[i]] = i;
    var _this = {};
    _this.glog = function(n) { if (n < 1) throw new Error("glog(" + n + ")"); return LOG_TABLE[n]; };
    _this.gexp = function(n) { while (n < 0) n += 255; while (n >= 256) n -= 255; return EXP_TABLE[n]; };
    return _this;
  })();

  function qrPolynomial(num, shift) {
    if (num.length == undefined) throw new Error(num.length + "/" + shift);
    var _num = (function() {
      var offset = 0;
      while (offset < num.length && num[offset] == 0) offset += 1;
      var r = new Array(num.length - offset + shift);
      for (var i = 0; i < num.length - offset; i += 1) r[i] = num[i + offset];
      return r;
    })();
    var _this = {};
    _this.getAt = function(index) { return _num[index]; };
    _this.getLength = function() { return _num.length; };
    _this.multiply = function(e) {
      var num = new Array(_this.getLength() + e.getLength() - 1);
      for (var i = 0; i < _this.getLength(); i += 1)
        for (var j = 0; j < e.getLength(); j += 1)
          num[i + j] ^= QRMath.gexp(QRMath.glog(_this.getAt(i)) + QRMath.glog(e.getAt(j)));
      return qrPolynomial(num, 0);
    };
    _this.mod = function(e) {
      if (_this.getLength() - e.getLength() < 0) return _this;
      var ratio = QRMath.glog(_this.getAt(0)) - QRMath.glog(e.getAt(0));
      var num = new Array(_this.getLength());
      for (var i = 0; i < _this.getLength(); i += 1) num[i] = _this.getAt(i);
      for (var i = 0; i < e.getLength(); i += 1) num[i] ^= QRMath.gexp(QRMath.glog(e.getAt(i)) + ratio);
      return qrPolynomial(num, 0).mod(e);
    };
    return _this;
  }

  function QRRSBlockCtor(totalCount, dataCount) { return { totalCount: totalCount, dataCount: dataCount }; }
  var QRRSBlock = (function() {
    var RS_BLOCK_TABLE = [
      [1,26,19],[1,26,16],[1,26,13],[1,26,9],
      [1,44,34],[1,44,28],[1,44,22],[1,44,16],
      [1,70,55],[1,70,44],[2,35,17],[2,35,13],
      [1,100,80],[2,50,32],[2,50,24],[4,25,9],
      [1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],
      [2,86,68],[4,43,27],[4,43,19],[4,43,15],
      [2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],
      [2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],
      [2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],
      [2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],
      [4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],
      [2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],
      [4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],
      [3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],
      [5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],
      [5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],
      [1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],
      [5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],
      [3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],
      [3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],
      [4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],
      [2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],
      [4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],
      [6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],
      [8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],
      [10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],
      [8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],
      [3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],
      [7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],
      [5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],
      [13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],
      [17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],
      [17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],
      [13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],
      [12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],
      [6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],
      [17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],
      [4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],
      [20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],
      [19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]
    ];
    var qrRSBlock = function(totalCount, dataCount) { return QRRSBlockCtor(totalCount, dataCount); };
    var getRsBlockTable = function(typeNumber, errorCorrectionLevel) {
      switch (errorCorrectionLevel) {
        case QRErrorCorrectionLevel.L: return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
        case QRErrorCorrectionLevel.M: return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
        case QRErrorCorrectionLevel.Q: return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
        case QRErrorCorrectionLevel.H: return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
        default: return undefined;
      }
    };
    var _this = {};
    _this.getRSBlocks = function(typeNumber, errorCorrectionLevel) {
      var rsBlock = getRsBlockTable(typeNumber, errorCorrectionLevel);
      if (rsBlock == undefined) throw new Error("bad rs block @ typeNumber:" + typeNumber + "/errorCorrectionLevel:" + errorCorrectionLevel);
      var length = rsBlock.length / 3, list = [];
      for (var i = 0; i < length; i += 1) {
        var count = rsBlock[i * 3 + 0], totalCount = rsBlock[i * 3 + 1], dataCount = rsBlock[i * 3 + 2];
        for (var j = 0; j < count; j += 1) list.push(qrRSBlock(totalCount, dataCount));
      }
      return list;
    };
    return _this;
  })();

  function qrBitBuffer() {
    var _buffer = [], _length = 0, _this = {};
    _this.getBuffer = function() { return _buffer; };
    _this.getAt = function(index) {
      var bufIndex = Math.floor(index / 8);
      return ((_buffer[bufIndex] >>> (7 - index % 8)) & 1) == 1;
    };
    _this.put = function(num, length) { for (var i = 0; i < length; i += 1) _this.putBit(((num >>> (length - i - 1)) & 1) == 1); };
    _this.getLengthInBits = function() { return _length; };
    _this.putBit = function(bit) {
      var bufIndex = Math.floor(_length / 8);
      if (_buffer.length <= bufIndex) _buffer.push(0);
      if (bit) _buffer[bufIndex] |= (0x80 >>> (_length % 8));
      _length += 1;
    };
    return _this;
  }

  function qr8BitByte(data) {
    var _mode = QRMode.MODE_8BIT_BYTE, _data = data, _bytes = qrcode.stringToBytes(data), _this = {};
    _this.getMode = function() { return _mode; };
    _this.getLength = function(buffer) { return _bytes.length; };
    _this.write = function(buffer) { for (var i = 0; i < _bytes.length; i += 1) buffer.put(_bytes[i], 8); };
    return _this;
  }

  return qrcode;
})();

// ── Rendu du QR code réel sur un <canvas> puis export en PNG ──
// (PNG plutôt que SVG : bien plus fiable dans le corps d'un email Outlook)
function buildInlineQrDataUrl(payload) {
  var qr = qrcode(0, 'M'); // type 0 = taille auto-détectée, correction M
  qr.addData(payload);
  qr.make();

  var moduleCount = qr.getModuleCount();
  var scale = 6;
  var quiet = 4; // marge blanche obligatoire autour d'un QR code pour qu'il reste scannable
  var size = (moduleCount + quiet * 2) * scale;

  var canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = '#111827';

  for (var row = 0; row < moduleCount; row++) {
    for (var col = 0; col < moduleCount; col++) {
      if (qr.isDark(row, col)) {
        ctx.fillRect((col + quiet) * scale, (row + quiet) * scale, scale, scale);
      }
    }
  }

  return canvas.toDataURL('image/png');
}

function buildQrDataUrl(email, name) {
  const parts = name.trim().split(' ');
  const firstName = parts[0] || '';
  const lastName = parts.slice(1).join(' ') || '';
  const vcard = [
    'BEGIN:VCARD', 'VERSION:3.0',
    'N:' + lastName + ';' + firstName + ';;;',
    'FN:' + name,
    'ORG:Timsoft Group',
    'EMAIL:' + email,
    'URL:https://www.timsoft-group.com',
    'END:VCARD'
  ].join('\n');
  return buildInlineQrDataUrl(vcard);
}

function onNewAppointmentComposeHandler(event) {
  event.completed();
}

async function onNewMessageComposeHandler(event) {
  try {
    const userEmail = Office.context.mailbox.userProfile.emailAddress;
    const userName  = Office.context.mailbox.userProfile.displayName || '';

    // 1. Essaie de récupérer le VRAI template créé dans le Dashboard
    let html = await fetchSignatureFromDashboard(userEmail);

    if (html) {
      // 2. Injecte photo + QR dans les placeholders {{photoUrl}} / {{qrCode}} du template
      html = normalizeTemplateAssets(html);
      html = await injectPhotoAndQr(html, userEmail, userName);
    } else {
      // 3. Fallback générique SEULEMENT si le Dashboard est injoignable
      //    ou si l'utilisateur/département n'existe pas encore en base
      html = await buildFallbackSignature(userEmail, userName);
    }

    Office.context.mailbox.item.body.setSignatureAsync(
      html,
      { coercionType: Office.CoercionType.Html },
      function() { event.completed(); }
    );
  } catch (e) {
    event.completed();
  }
}

// ── Récupère le template ACTIF du département depuis le Dashboard ──
async function fetchSignatureFromDashboard(email) {
  const url = API_URL + '/Signatures/by-email/' + encodeURIComponent(email) + '/active';
  try {
    const res = await fetch(url, {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.generatedHtml || null;
  } catch (e) {
    return null;
  }
}

// ── Remplace {{photoUrl}} et {{qrCode}} dans le HTML reçu du Dashboard ──
async function injectPhotoAndQr(html, email, name) {
  const photo = await getCachedOrFetchPhoto(email);
  const parts = name.trim().split(' ');
  const firstName = parts[0] || '';
  const lastName  = parts.slice(1).join(' ') || '';
  const initials  = ((firstName[0] || '') + (lastName[0] || '')).toUpperCase() || '??';

  const qrUrl = buildQrDataUrl(email, name);

  // Remplace toute la balise <img ... {{photoUrl}} ... /> par la vraie photo,
  // ou par un cercle d'initiales si aucune photo n'est disponible (évite l'icône cassée)
  const placeholder = '{{photoUrl}}';
  const idx = html.indexOf(placeholder);

  if (idx !== -1) {
    const tagStart = html.lastIndexOf('<img', idx);
    const tagEnd = html.indexOf('>', idx);
    if (tagStart !== -1 && tagEnd !== -1) {
      let replacement;
      if (photo) {
        const imgTag = html.substring(tagStart, tagEnd + 1);
        replacement = imgTag.split(placeholder).join(photo);
      } else {
        replacement = '<div style="width:65px;height:65px;border-radius:50%;' +
          'background:linear-gradient(135deg,#1a1f5e,#2d3491);display:flex;' +
          'align-items:center;justify-content:center;color:#fff;font-weight:700;' +
          'font-size:22px;">' + initials + '</div>';
      }
      html = html.substring(0, tagStart) + replacement + html.substring(tagEnd + 1);
    }
  }

  return html.split('{{qrCode}}').join(qrUrl);
}

// ── Fallback : signature générique construite localement ──
async function buildFallbackSignature(email, name) {
  const parts     = name.trim().split(' ');
  const firstName = parts[0] || '';
  const lastName  = parts.slice(1).join(' ') || '';
  const initials  = ((firstName[0] || '') + (lastName[0] || '')).toUpperCase() || '??';

  const photo = await getCachedOrFetchPhoto(email);

  const photoEl = photo
    ? '<img src="' + photo + '" width="65" height="65" style="border-radius:50%;object-fit:cover;border:2px solid #e5e7eb;display:block;" alt="' + name + '"/>'
    : '<div style="width:65px;height:65px;border-radius:50%;background:linear-gradient(135deg,#1a1f5e,#2d3491);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:22px;">' + initials + '</div>';

  const qrUrl = buildQrDataUrl(email, name);

  return '<table style="font-family:Segoe UI,Arial,sans-serif;border-collapse:collapse;max-width:540px;">' +
    '<tr>' +
      '<td style="padding-right:16px;vertical-align:middle;">' + photoEl + '</td>' +
      '<td style="padding:0 16px;vertical-align:middle;border-left:3px solid #1a1f5e;">' +
        '<p style="margin:0 0 3px;font-size:16px;font-weight:700;color:#1a1f5e;">' + firstName + ' ' + lastName + '</p>' +
        '<p style="margin:0 0 8px;font-size:12px;color:#6b7280;">Timsoft Group</p>' +
        '<p style="margin:0 0 3px;font-size:12px;color:#374151;">&#9993;&nbsp;<a href="mailto:' + email + '" style="color:#374151;text-decoration:none;">' + email + '</a></p>' +
        '<p style="margin:5px 0 0;font-size:12px;"><a href="https://www.timsoft-group.com" style="color:#1a1f5e;font-weight:600;text-decoration:none;">www.timsoft-group.com</a></p>' +
      '</td>' +
      '<td style="padding-left:16px;vertical-align:middle;text-align:center;">' +
        '<img src="' + qrUrl + '" width="80" height="80" alt="QR Code" style="border:1px solid #e5e7eb;border-radius:8px;display:block;"/>' +
        '<p style="margin:5px 0 0;font-size:9px;color:#9ca3af;line-height:1.4;">Scanner pour<br>ajouter le contact</p>' +
      '</td>' +
    '</tr>' +
  '</table>';
}

// ── Photo Outlook avec cache localStorage (partagé avec index.html, même origine) ──
function getCachedOrFetchPhoto(email) {
  return new Promise((resolve) => {
    try {
      const cached = localStorage.getItem('timsoft_photo_' + email);
      if (cached) return resolve(cached);
    } catch (e) {}

    const timer = setTimeout(() => resolve(null), 2500);

    try {
      Office.context.mailbox.getCallbackTokenAsync({ isRest: true }, async function(result) {
        if (result.status !== Office.AsyncResultStatus.Succeeded) {
          clearTimeout(timer);
          return resolve(null);
        }

        const token   = result.value;
        const restUrl = Office.context.mailbox.restUrl || 'https://outlook.office.com/api';

        try {
          const res = await fetch(restUrl + '/v2.0/me/photo/$value', {
            headers: { 'Authorization': 'Bearer ' + token }
          });
          clearTimeout(timer);

          if (res.ok) {
            const blob = await res.blob();
            if (blob.size > 0) {
              const reader = new FileReader();
              reader.onloadend = function() {
                try { localStorage.setItem('timsoft_photo_' + email, reader.result); } catch (e) {}
                resolve(reader.result);
              };
              reader.readAsDataURL(blob);
              return;
            }
          }
          resolve(null);
        } catch (e) {
          clearTimeout(timer);
          resolve(null);
        }
      });
    } catch (e) {
      clearTimeout(timer);
      resolve(null);
    }
  });
}