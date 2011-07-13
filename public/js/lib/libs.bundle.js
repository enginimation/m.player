//chardet
/***/
/*
 * The Original Code is Mozilla Universal charset detector code.
 *
 * The Initial Developer of the Original Code is
 * Netscape Communications Corporation.
 * Portions created by the Initial Developer are Copyright (C) 2001
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   António Afonso (antonio.afonso gmail.com) - port to JavaScript
 *   Mark Pilgrim - port to Python
 *   Shy Shalom - original C code
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301  USA
 */

var jschardet = {};
jschardet.VERSION = "0.1";
jschardet.detect = function(aBuf) {
    var u = new jschardet.UniversalDetector();
    u.reset();
    if( aBuf instanceof Array ) {
        u.feed(String.fromCharCode.apply(String, aBuf));
    } else {
        u.feed(aBuf);
    }
    u.close();
    return u.result;
}

/*
 * The Original Code is Mozilla Universal charset detector code.
 *
 * The Initial Developer of the Original Code is
 * Netscape Communications Corporation.
 * Portions created by the Initial Developer are Copyright (C) 2001
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   António Afonso (antonio.afonso gmail.com) - port to JavaScript
 *   Mark Pilgrim - port to Python
 *   Shy Shalom - original C code
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301  USA
 */
jschardet.Constants = {
    _debug      : false,

    detecting   : 0,
    foundIt     : 1,
    notMe       : 2,

    start       : 0,
    error       : 1,
    itsMe       : 2,

    SHORTCUT_THRESHOLD  : 0.95
};
/*
 * The Original Code is Mozilla Universal charset detector code.
 *
 * The Initial Developer of the Original Code is
 * Netscape Communications Corporation.
 * Portions created by the Initial Developer are Copyright (C) 2001
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   António Afonso (antonio.afonso gmail.com) - port to JavaScript
 *   Mark Pilgrim - port to Python
 *   Shy Shalom - original C code
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301  USA
 */

jschardet.CodingStateMachine = function(sm) {
    var self = this;

    function init(sm) {
        self._mModel = sm;
        self._mCurrentBytePos = 0;
        self._mCurrentCharLen = 0;
        self.reset();
    }

    this.reset = function() {
        this._mCurrentState = jschardet.Constants.start;
    }

    this.nextState = function(c) {
        // for each byte we get its class
        // if it is first byte, we also get byte length
        var byteCls = this._mModel.classTable[c.charCodeAt(0)];
        if( this._mCurrentState == jschardet.Constants.start ) {
            this._mCurrentBytePos = 0;
            this._mCurrentCharLen = this._mModel.charLenTable[byteCls];
        }
        // from byte's class and stateTable, we get its next state
        this._mCurrentState = this._mModel.stateTable[this._mCurrentState * this._mModel.classFactor + byteCls];
        this._mCurrentBytePos++;
        return this._mCurrentState;
    }

    this.getCurrentCharLen = function() {
        return this._mCurrentCharLen;
    }

    this.getCodingStateMachine = function() {
        return this._mModel.name;
    }

    init(sm);
}

/*
 * The Original Code is Mozilla Universal charset detector code.
 *
 * The Initial Developer of the Original Code is
 * Netscape Communications Corporation.
 * Portions created by the Initial Developer are Copyright (C) 2001
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   António Afonso (antonio.afonso gmail.com) - port to JavaScript
 *   Mark Pilgrim - port to Python
 *   Shy Shalom - original C code
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301  USA
 */

jschardet.HZ_cls = [
    1,0,0,0,0,0,0,0,  // 00 - 07
    0,0,0,0,0,0,0,0,  // 08 - 0f
    0,0,0,0,0,0,0,0,  // 10 - 17
    0,0,0,1,0,0,0,0,  // 18 - 1f
    0,0,0,0,0,0,0,0,  // 20 - 27
    0,0,0,0,0,0,0,0,  // 28 - 2f
    0,0,0,0,0,0,0,0,  // 30 - 37
    0,0,0,0,0,0,0,0,  // 38 - 3f
    0,0,0,0,0,0,0,0,  // 40 - 47
    0,0,0,0,0,0,0,0,  // 48 - 4f
    0,0,0,0,0,0,0,0,  // 50 - 57
    0,0,0,0,0,0,0,0,  // 58 - 5f
    0,0,0,0,0,0,0,0,  // 60 - 67
    0,0,0,0,0,0,0,0,  // 68 - 6f
    0,0,0,0,0,0,0,0,  // 70 - 77
    0,0,0,4,0,5,2,0,  // 78 - 7f
    1,1,1,1,1,1,1,1,  // 80 - 87
    1,1,1,1,1,1,1,1,  // 88 - 8f
    1,1,1,1,1,1,1,1,  // 90 - 97
    1,1,1,1,1,1,1,1,  // 98 - 9f
    1,1,1,1,1,1,1,1,  // a0 - a7
    1,1,1,1,1,1,1,1,  // a8 - af
    1,1,1,1,1,1,1,1,  // b0 - b7
    1,1,1,1,1,1,1,1,  // b8 - bf
    1,1,1,1,1,1,1,1,  // c0 - c7
    1,1,1,1,1,1,1,1,  // c8 - cf
    1,1,1,1,1,1,1,1,  // d0 - d7
    1,1,1,1,1,1,1,1,  // d8 - df
    1,1,1,1,1,1,1,1,  // e0 - e7
    1,1,1,1,1,1,1,1,  // e8 - ef
    1,1,1,1,1,1,1,1,  // f0 - f7
    1,1,1,1,1,1,1,1   // f8 - ff
];

with( jschardet.Constants )
jschardet.HZ_st = [
    start,error,    3,start,start,start,error,error, // 00-07
    error,error,error,error,itsMe,itsMe,itsMe,itsMe, // 08-0f
    itsMe,itsMe,error,error,start,start,    4,error, // 10-17
        5,error,    6,error,    5,    5,    4,error, // 18-1f
        4,error,    4,    4,    4,error,    4,error, // 20-27
        4,itsMe,start,start,start,start,start,start  // 28-2f
];

jschardet.HZCharLenTable = [0, 0, 0, 0, 0, 0];

jschardet.HZSMModel = {
    "classTable"    : jschardet.HZ_cls,
    "classFactor"   : 6,
    "stateTable"    : jschardet.HZ_st,
    "charLenTable"  : jschardet.HZCharLenTable,
    "name"          : "HZ-GB-2312"
};

jschardet.ISO2022CN_cls = [
    2,0,0,0,0,0,0,0,  // 00 - 07
    0,0,0,0,0,0,0,0,  // 08 - 0f
    0,0,0,0,0,0,0,0,  // 10 - 17
    0,0,0,1,0,0,0,0,  // 18 - 1f
    0,0,0,0,0,0,0,0,  // 20 - 27
    0,3,0,0,0,0,0,0,  // 28 - 2f
    0,0,0,0,0,0,0,0,  // 30 - 37
    0,0,0,0,0,0,0,0,  // 38 - 3f
    0,0,0,4,0,0,0,0,  // 40 - 47
    0,0,0,0,0,0,0,0,  // 48 - 4f
    0,0,0,0,0,0,0,0,  // 50 - 57
    0,0,0,0,0,0,0,0,  // 58 - 5f
    0,0,0,0,0,0,0,0,  // 60 - 67
    0,0,0,0,0,0,0,0,  // 68 - 6f
    0,0,0,0,0,0,0,0,  // 70 - 77
    0,0,0,0,0,0,0,0,  // 78 - 7f
    2,2,2,2,2,2,2,2,  // 80 - 87
    2,2,2,2,2,2,2,2,  // 88 - 8f
    2,2,2,2,2,2,2,2,  // 90 - 97
    2,2,2,2,2,2,2,2,  // 98 - 9f
    2,2,2,2,2,2,2,2,  // a0 - a7
    2,2,2,2,2,2,2,2,  // a8 - af
    2,2,2,2,2,2,2,2,  // b0 - b7
    2,2,2,2,2,2,2,2,  // b8 - bf
    2,2,2,2,2,2,2,2,  // c0 - c7
    2,2,2,2,2,2,2,2,  // c8 - cf
    2,2,2,2,2,2,2,2,  // d0 - d7
    2,2,2,2,2,2,2,2,  // d8 - df
    2,2,2,2,2,2,2,2,  // e0 - e7
    2,2,2,2,2,2,2,2,  // e8 - ef
    2,2,2,2,2,2,2,2,  // f0 - f7
    2,2,2,2,2,2,2,2   // f8 - ff
];

with( jschardet.Constants )
jschardet.ISO2022CN_st = [
    start,    3,error,start,start,start,start,start, // 00-07
    start,error,error,error,error,error,error,error, // 08-0f
    error,error,itsMe,itsMe,itsMe,itsMe,itsMe,itsMe, // 10-17
    itsMe,itsMe,itsMe,error,error,error,    4,error, // 18-1f
    error,error,error,itsMe,error,error,error,error, // 20-27
        5,    6,error,error,error,error,error,error, // 28-2f
    error,error,error,itsMe,error,error,error,error, // 30-37
    error,error,error,error,error,itsMe,error,start  // 38-3f
];

jschardet.ISO2022CNCharLenTable = [0, 0, 0, 0, 0, 0, 0, 0, 0];

jschardet.ISO2022CNSMModel = {
    "classTable"    : jschardet.ISO2022CN_cls,
    "classFactor"   : 9,
    "stateTable"    : jschardet.ISO2022CN_st,
    "charLenTable"  : jschardet.ISO2022CNCharLenTable,
    "name"          : "ISO-2022-CN"
};

jschardet.ISO2022JP_cls = [
    2,0,0,0,0,0,0,0,  // 00 - 07
    0,0,0,0,0,0,2,2,  // 08 - 0f
    0,0,0,0,0,0,0,0,  // 10 - 17
    0,0,0,1,0,0,0,0,  // 18 - 1f
    0,0,0,0,7,0,0,0,  // 20 - 27
    3,0,0,0,0,0,0,0,  // 28 - 2f
    0,0,0,0,0,0,0,0,  // 30 - 37
    0,0,0,0,0,0,0,0,  // 38 - 3f
    6,0,4,0,8,0,0,0,  // 40 - 47
    0,9,5,0,0,0,0,0,  // 48 - 4f
    0,0,0,0,0,0,0,0,  // 50 - 57
    0,0,0,0,0,0,0,0,  // 58 - 5f
    0,0,0,0,0,0,0,0,  // 60 - 67
    0,0,0,0,0,0,0,0,  // 68 - 6f
    0,0,0,0,0,0,0,0,  // 70 - 77
    0,0,0,0,0,0,0,0,  // 78 - 7f
    2,2,2,2,2,2,2,2,  // 80 - 87
    2,2,2,2,2,2,2,2,  // 88 - 8f
    2,2,2,2,2,2,2,2,  // 90 - 97
    2,2,2,2,2,2,2,2,  // 98 - 9f
    2,2,2,2,2,2,2,2,  // a0 - a7
    2,2,2,2,2,2,2,2,  // a8 - af
    2,2,2,2,2,2,2,2,  // b0 - b7
    2,2,2,2,2,2,2,2,  // b8 - bf
    2,2,2,2,2,2,2,2,  // c0 - c7
    2,2,2,2,2,2,2,2,  // c8 - cf
    2,2,2,2,2,2,2,2,  // d0 - d7
    2,2,2,2,2,2,2,2,  // d8 - df
    2,2,2,2,2,2,2,2,  // e0 - e7
    2,2,2,2,2,2,2,2,  // e8 - ef
    2,2,2,2,2,2,2,2,  // f0 - f7
    2,2,2,2,2,2,2,2   // f8 - ff
];

with( jschardet.Constants )
jschardet.ISO2022JP_st = [
    start,    3,error,start,start,start,start,start, // 00-07
    start,start,error,error,error,error,error,error, // 08-0f
    error,error,error,error,itsMe,itsMe,itsMe,itsMe, // 10-17
    itsMe,itsMe,itsMe,itsMe,itsMe,itsMe,error,error, // 18-1f
    error,    5,error,error,error,    4,error,error, // 20-27
    error,error,error,    6,itsMe,error,itsMe,error, // 28-2f
    error,error,error,error,error,error,itsMe,itsMe, // 30-37
    error,error,error,itsMe,error,error,error,error, // 38-3f
    error,error,error,error,itsMe,error,start,start  // 40-47
];

jschardet.ISO2022JPCharLenTable = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

jschardet.ISO2022JPSMModel = {
    "classTable"    : jschardet.ISO2022JP_cls,
    "classFactor"   : 10,
    "stateTable"    : jschardet.ISO2022JP_st,
    "charLenTable"  : jschardet.ISO2022JPCharLenTable,
    "name"          : "ISO-2022-JP"
};

jschardet.ISO2022KR_cls = [
    2,0,0,0,0,0,0,0,  // 00 - 07
    0,0,0,0,0,0,0,0,  // 08 - 0f
    0,0,0,0,0,0,0,0,  // 10 - 17
    0,0,0,1,0,0,0,0,  // 18 - 1f
    0,0,0,0,3,0,0,0,  // 20 - 27
    0,4,0,0,0,0,0,0,  // 28 - 2f
    0,0,0,0,0,0,0,0,  // 30 - 37
    0,0,0,0,0,0,0,0,  // 38 - 3f
    0,0,0,5,0,0,0,0,  // 40 - 47
    0,0,0,0,0,0,0,0,  // 48 - 4f
    0,0,0,0,0,0,0,0,  // 50 - 57
    0,0,0,0,0,0,0,0,  // 58 - 5f
    0,0,0,0,0,0,0,0,  // 60 - 67
    0,0,0,0,0,0,0,0,  // 68 - 6f
    0,0,0,0,0,0,0,0,  // 70 - 77
    0,0,0,0,0,0,0,0,  // 78 - 7f
    2,2,2,2,2,2,2,2,  // 80 - 87
    2,2,2,2,2,2,2,2,  // 88 - 8f
    2,2,2,2,2,2,2,2,  // 90 - 97
    2,2,2,2,2,2,2,2,  // 98 - 9f
    2,2,2,2,2,2,2,2,  // a0 - a7
    2,2,2,2,2,2,2,2,  // a8 - af
    2,2,2,2,2,2,2,2,  // b0 - b7
    2,2,2,2,2,2,2,2,  // b8 - bf
    2,2,2,2,2,2,2,2,  // c0 - c7
    2,2,2,2,2,2,2,2,  // c8 - cf
    2,2,2,2,2,2,2,2,  // d0 - d7
    2,2,2,2,2,2,2,2,  // d8 - df
    2,2,2,2,2,2,2,2,  // e0 - e7
    2,2,2,2,2,2,2,2,  // e8 - ef
    2,2,2,2,2,2,2,2,  // f0 - f7
    2,2,2,2,2,2,2,2   // f8 - ff
];

with( jschardet.Constants )
jschardet.ISO2022KR_st = [
    start,    3,error,start,start,start,error,error, // 00-07
    error,error,error,error,itsMe,itsMe,itsMe,itsMe, // 08-0f
    itsMe,itsMe,error,error,error,    4,error,error, // 10-17
    error,error,error,error,    5,error,error,error, // 18-1f
    error,error,error,itsMe,start,start,start,start  // 20-27
];

jschardet.ISO2022KRCharLenTable = [0, 0, 0, 0, 0, 0];

jschardet.ISO2022KRSMModel = {
    "classTable"    : jschardet.ISO2022KR_cls,
    "classFactor"   : 6,
    "stateTable"    : jschardet.ISO2022KR_st,
    "charLenTable"  : jschardet.ISO2022KRCharLenTable,
    "name"          : "ISO-2022-KR"
};

/*
 * The Original Code is Mozilla Universal charset detector code.
 *
 * The Initial Developer of the Original Code is
 * Netscape Communications Corporation.
 * Portions created by the Initial Developer are Copyright (C) 2001
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   António Afonso (antonio.afonso gmail.com) - port to JavaScript
 *   Mark Pilgrim - port to Python
 *   Shy Shalom - original C code
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301  USA
 */

// BIG5

jschardet.BIG5_cls = [
    1,1,1,1,1,1,1,1,  // 00 - 07    //allow 0x00 as legal value
    1,1,1,1,1,1,0,0,  // 08 - 0f
    1,1,1,1,1,1,1,1,  // 10 - 17
    1,1,1,0,1,1,1,1,  // 18 - 1f
    1,1,1,1,1,1,1,1,  // 20 - 27
    1,1,1,1,1,1,1,1,  // 28 - 2f
    1,1,1,1,1,1,1,1,  // 30 - 37
    1,1,1,1,1,1,1,1,  // 38 - 3f
    2,2,2,2,2,2,2,2,  // 40 - 47
    2,2,2,2,2,2,2,2,  // 48 - 4f
    2,2,2,2,2,2,2,2,  // 50 - 57
    2,2,2,2,2,2,2,2,  // 58 - 5f
    2,2,2,2,2,2,2,2,  // 60 - 67
    2,2,2,2,2,2,2,2,  // 68 - 6f
    2,2,2,2,2,2,2,2,  // 70 - 77
    2,2,2,2,2,2,2,1,  // 78 - 7f
    4,4,4,4,4,4,4,4,  // 80 - 87
    4,4,4,4,4,4,4,4,  // 88 - 8f
    4,4,4,4,4,4,4,4,  // 90 - 97
    4,4,4,4,4,4,4,4,  // 98 - 9f
    4,3,3,3,3,3,3,3,  // a0 - a7
    3,3,3,3,3,3,3,3,  // a8 - af
    3,3,3,3,3,3,3,3,  // b0 - b7
    3,3,3,3,3,3,3,3,  // b8 - bf
    3,3,3,3,3,3,3,3,  // c0 - c7
    3,3,3,3,3,3,3,3,  // c8 - cf
    3,3,3,3,3,3,3,3,  // d0 - d7
    3,3,3,3,3,3,3,3,  // d8 - df
    3,3,3,3,3,3,3,3,  // e0 - e7
    3,3,3,3,3,3,3,3,  // e8 - ef
    3,3,3,3,3,3,3,3,  // f0 - f7
    3,3,3,3,3,3,3,0   // f8 - ff
];

with( jschardet.Constants )
jschardet.BIG5_st = [
    error,start,start,    3,error,error,error,error, //00-07
    error,error,itsMe,itsMe,itsMe,itsMe,itsMe,error, //08-0f
    error,start,start,start,start,start,start,start  //10-17
];

jschardet.Big5CharLenTable = [0, 1, 1, 2, 0];

jschardet.Big5SMModel = {
    "classTable"    : jschardet.BIG5_cls,
    "classFactor"   : 5,
    "stateTable"    : jschardet.BIG5_st,
    "charLenTable"  : jschardet.Big5CharLenTable,
    "name"          : "Big5"
};

// EUC-JP

jschardet.EUCJP_cls = [
    4,4,4,4,4,4,4,4,  // 00 - 07
    4,4,4,4,4,4,5,5,  // 08 - 0f
    4,4,4,4,4,4,4,4,  // 10 - 17
    4,4,4,5,4,4,4,4,  // 18 - 1f
    4,4,4,4,4,4,4,4,  // 20 - 27
    4,4,4,4,4,4,4,4,  // 28 - 2f
    4,4,4,4,4,4,4,4,  // 30 - 37
    4,4,4,4,4,4,4,4,  // 38 - 3f
    4,4,4,4,4,4,4,4,  // 40 - 47
    4,4,4,4,4,4,4,4,  // 48 - 4f
    4,4,4,4,4,4,4,4,  // 50 - 57
    4,4,4,4,4,4,4,4,  // 58 - 5f
    4,4,4,4,4,4,4,4,  // 60 - 67
    4,4,4,4,4,4,4,4,  // 68 - 6f
    4,4,4,4,4,4,4,4,  // 70 - 77
    4,4,4,4,4,4,4,4,  // 78 - 7f
    5,5,5,5,5,5,5,5,  // 80 - 87
    5,5,5,5,5,5,1,3,  // 88 - 8f
    5,5,5,5,5,5,5,5,  // 90 - 97
    5,5,5,5,5,5,5,5,  // 98 - 9f
    5,2,2,2,2,2,2,2,  // a0 - a7
    2,2,2,2,2,2,2,2,  // a8 - af
    2,2,2,2,2,2,2,2,  // b0 - b7
    2,2,2,2,2,2,2,2,  // b8 - bf
    2,2,2,2,2,2,2,2,  // c0 - c7
    2,2,2,2,2,2,2,2,  // c8 - cf
    2,2,2,2,2,2,2,2,  // d0 - d7
    2,2,2,2,2,2,2,2,  // d8 - df
    0,0,0,0,0,0,0,0,  // e0 - e7
    0,0,0,0,0,0,0,0,  // e8 - ef
    0,0,0,0,0,0,0,0,  // f0 - f7
    0,0,0,0,0,0,0,5   // f8 - ff
];

with( jschardet.Constants )
jschardet.EUCJP_st = [
         3,    4,    3,    5,start,error,error,error, //00-07
     error,error,error,error,itsMe,itsMe,itsMe,itsMe, //08-0f
     itsMe,itsMe,start,error,start,error,error,error, //10-17
     error,error,start,error,error,error,    3,error, //18-1f
         3,error,error,error,start,start,start,start  //20-27
];

jschardet.EUCJPCharLenTable = [2, 2, 2, 3, 1, 0];

jschardet.EUCJPSMModel = {
    "classTable"    : jschardet.EUCJP_cls,
    "classFactor"   : 6,
    "stateTable"    : jschardet.EUCJP_st,
    "charLenTable"  : jschardet.EUCJPCharLenTable,
    "name"          : "EUC-JP"
};

// EUC-KR

jschardet.EUCKR_cls  = [
    1,1,1,1,1,1,1,1,  // 00 - 07
    1,1,1,1,1,1,0,0,  // 08 - 0f
    1,1,1,1,1,1,1,1,  // 10 - 17
    1,1,1,0,1,1,1,1,  // 18 - 1f
    1,1,1,1,1,1,1,1,  // 20 - 27
    1,1,1,1,1,1,1,1,  // 28 - 2f
    1,1,1,1,1,1,1,1,  // 30 - 37
    1,1,1,1,1,1,1,1,  // 38 - 3f
    1,1,1,1,1,1,1,1,  // 40 - 47
    1,1,1,1,1,1,1,1,  // 48 - 4f
    1,1,1,1,1,1,1,1,  // 50 - 57
    1,1,1,1,1,1,1,1,  // 58 - 5f
    1,1,1,1,1,1,1,1,  // 60 - 67
    1,1,1,1,1,1,1,1,  // 68 - 6f
    1,1,1,1,1,1,1,1,  // 70 - 77
    1,1,1,1,1,1,1,1,  // 78 - 7f
    0,0,0,0,0,0,0,0,  // 80 - 87
    0,0,0,0,0,0,0,0,  // 88 - 8f
    0,0,0,0,0,0,0,0,  // 90 - 97
    0,0,0,0,0,0,0,0,  // 98 - 9f
    0,2,2,2,2,2,2,2,  // a0 - a7
    2,2,2,2,2,3,3,3,  // a8 - af
    2,2,2,2,2,2,2,2,  // b0 - b7
    2,2,2,2,2,2,2,2,  // b8 - bf
    2,2,2,2,2,2,2,2,  // c0 - c7
    2,3,2,2,2,2,2,2,  // c8 - cf
    2,2,2,2,2,2,2,2,  // d0 - d7
    2,2,2,2,2,2,2,2,  // d8 - df
    2,2,2,2,2,2,2,2,  // e0 - e7
    2,2,2,2,2,2,2,2,  // e8 - ef
    2,2,2,2,2,2,2,2,  // f0 - f7
    2,2,2,2,2,2,2,0   // f8 - ff
];

with( jschardet.Constants )
jschardet.EUCKR_st = [
    error,start,    3,error,error,error,error,error, //00-07
    itsMe,itsMe,itsMe,itsMe,error,error,start,start  //08-0f
];

jschardet.EUCKRCharLenTable = [0, 1, 2, 0];

jschardet.EUCKRSMModel = {
    "classTable"    : jschardet.EUCKR_cls,
    "classFactor"   : 4,
    "stateTable"    : jschardet.EUCKR_st,
    "charLenTable"  : jschardet.EUCKRCharLenTable,
    "name"          : "EUC-KR"
};

// EUC-TW

jschardet.EUCTW_cls = [
    2,2,2,2,2,2,2,2,  // 00 - 07
    2,2,2,2,2,2,0,0,  // 08 - 0f
    2,2,2,2,2,2,2,2,  // 10 - 17
    2,2,2,0,2,2,2,2,  // 18 - 1f
    2,2,2,2,2,2,2,2,  // 20 - 27
    2,2,2,2,2,2,2,2,  // 28 - 2f
    2,2,2,2,2,2,2,2,  // 30 - 37
    2,2,2,2,2,2,2,2,  // 38 - 3f
    2,2,2,2,2,2,2,2,  // 40 - 47
    2,2,2,2,2,2,2,2,  // 48 - 4f
    2,2,2,2,2,2,2,2,  // 50 - 57
    2,2,2,2,2,2,2,2,  // 58 - 5f
    2,2,2,2,2,2,2,2,  // 60 - 67
    2,2,2,2,2,2,2,2,  // 68 - 6f
    2,2,2,2,2,2,2,2,  // 70 - 77
    2,2,2,2,2,2,2,2,  // 78 - 7f
    0,0,0,0,0,0,0,0,  // 80 - 87
    0,0,0,0,0,0,6,0,  // 88 - 8f
    0,0,0,0,0,0,0,0,  // 90 - 97
    0,0,0,0,0,0,0,0,  // 98 - 9f
    0,3,4,4,4,4,4,4,  // a0 - a7
    5,5,1,1,1,1,1,1,  // a8 - af
    1,1,1,1,1,1,1,1,  // b0 - b7
    1,1,1,1,1,1,1,1,  // b8 - bf
    1,1,3,1,3,3,3,3,  // c0 - c7
    3,3,3,3,3,3,3,3,  // c8 - cf
    3,3,3,3,3,3,3,3,  // d0 - d7
    3,3,3,3,3,3,3,3,  // d8 - df
    3,3,3,3,3,3,3,3,  // e0 - e7
    3,3,3,3,3,3,3,3,  // e8 - ef
    3,3,3,3,3,3,3,3,  // f0 - f7
    3,3,3,3,3,3,3,0   // f8 - ff
];

with( jschardet.Constants )
jschardet.EUCTW_st = [
    error,error,start,    3,    3,    3,    4,error, //00-07
    error,error,error,error,error,error,itsMe,itsMe, //08-0f
    itsMe,itsMe,itsMe,itsMe,itsMe,error,start,error, //10-17
    start,start,start,error,error,error,error,error, //18-1f
        5,error,error,error,start,error,start,start, //20-27
    start,error,start,start,start,start,start,start  //28-2f
];

jschardet.EUCTWCharLenTable = [0, 0, 1, 2, 2, 2, 3];

jschardet.EUCTWSMModel = {
    "classTable"    : jschardet.EUCTW_cls,
    "classFactor"   : 7,
    "stateTable"    : jschardet.EUCTW_st,
    "charLenTable"  : jschardet.EUCTWCharLenTable,
    "name"          : "x-euc-tw"
};

// GB2312

jschardet.GB2312_cls = [
    1,1,1,1,1,1,1,1,  // 00 - 07
    1,1,1,1,1,1,0,0,  // 08 - 0f
    1,1,1,1,1,1,1,1,  // 10 - 17
    1,1,1,0,1,1,1,1,  // 18 - 1f
    1,1,1,1,1,1,1,1,  // 20 - 27
    1,1,1,1,1,1,1,1,  // 28 - 2f
    3,3,3,3,3,3,3,3,  // 30 - 37
    3,3,1,1,1,1,1,1,  // 38 - 3f
    2,2,2,2,2,2,2,2,  // 40 - 47
    2,2,2,2,2,2,2,2,  // 48 - 4f
    2,2,2,2,2,2,2,2,  // 50 - 57
    2,2,2,2,2,2,2,2,  // 58 - 5f
    2,2,2,2,2,2,2,2,  // 60 - 67
    2,2,2,2,2,2,2,2,  // 68 - 6f
    2,2,2,2,2,2,2,2,  // 70 - 77
    2,2,2,2,2,2,2,4,  // 78 - 7f
    5,6,6,6,6,6,6,6,  // 80 - 87
    6,6,6,6,6,6,6,6,  // 88 - 8f
    6,6,6,6,6,6,6,6,  // 90 - 97
    6,6,6,6,6,6,6,6,  // 98 - 9f
    6,6,6,6,6,6,6,6,  // a0 - a7
    6,6,6,6,6,6,6,6,  // a8 - af
    6,6,6,6,6,6,6,6,  // b0 - b7
    6,6,6,6,6,6,6,6,  // b8 - bf
    6,6,6,6,6,6,6,6,  // c0 - c7
    6,6,6,6,6,6,6,6,  // c8 - cf
    6,6,6,6,6,6,6,6,  // d0 - d7
    6,6,6,6,6,6,6,6,  // d8 - df
    6,6,6,6,6,6,6,6,  // e0 - e7
    6,6,6,6,6,6,6,6,  // e8 - ef
    6,6,6,6,6,6,6,6,  // f0 - f7
    6,6,6,6,6,6,6,0   // f8 - ff
];

with( jschardet.Constants )
jschardet.GB2312_st = [
    error,start,start,start,start,start,    3,error, //00-07
    error,error,error,error,error,error,itsMe,itsMe, //08-0f
    itsMe,itsMe,itsMe,itsMe,itsMe,error,error,start, //10-17
        4,error,start,start,error,error,error,error, //18-1f
    error,error,    5,error,error,error,itsMe,error, //20-27
    error,error,start,start,start,start,start,start  //28-2f
];

// To be accurate, the length of class 6 can be either 2 or 4.
// But it is not necessary to discriminate between the two since
// it is used for frequency analysis only, and we are validing
// each code range there as well. So it is safe to set it to be
// 2 here.
jschardet.GB2312CharLenTable = [0, 1, 1, 1, 1, 1, 2];

jschardet.GB2312SMModel = {
    "classTable"    : jschardet.GB2312_cls,
    "classFactor"   : 7,
    "stateTable"    : jschardet.GB2312_st,
    "charLenTable"  : jschardet.GB2312CharLenTable,
    "name"          : "GB2312"
};

// Shift_JIS

jschardet.SJIS_cls = [
    1,1,1,1,1,1,1,1,  // 00 - 07
    1,1,1,1,1,1,0,0,  // 08 - 0f
    1,1,1,1,1,1,1,1,  // 10 - 17
    1,1,1,0,1,1,1,1,  // 18 - 1f
    1,1,1,1,1,1,1,1,  // 20 - 27
    1,1,1,1,1,1,1,1,  // 28 - 2f
    1,1,1,1,1,1,1,1,  // 30 - 37
    1,1,1,1,1,1,1,1,  // 38 - 3f
    2,2,2,2,2,2,2,2,  // 40 - 47
    2,2,2,2,2,2,2,2,  // 48 - 4f
    2,2,2,2,2,2,2,2,  // 50 - 57
    2,2,2,2,2,2,2,2,  // 58 - 5f
    2,2,2,2,2,2,2,2,  // 60 - 67
    2,2,2,2,2,2,2,2,  // 68 - 6f
    2,2,2,2,2,2,2,2,  // 70 - 77
    2,2,2,2,2,2,2,1,  // 78 - 7f
    3,3,3,3,3,3,3,3,  // 80 - 87
    3,3,3,3,3,3,3,3,  // 88 - 8f
    3,3,3,3,3,3,3,3,  // 90 - 97
    3,3,3,3,3,3,3,3,  // 98 - 9f
    // 0xa0 is illegal in sjis encoding, but some pages does
    // contain such byte. We need to be more error forgiven.
    2,2,2,2,2,2,2,2,  // a0 - a7
    2,2,2,2,2,2,2,2,  // a8 - af
    2,2,2,2,2,2,2,2,  // b0 - b7
    2,2,2,2,2,2,2,2,  // b8 - bf
    2,2,2,2,2,2,2,2,  // c0 - c7
    2,2,2,2,2,2,2,2,  // c8 - cf
    2,2,2,2,2,2,2,2,  // d0 - d7
    2,2,2,2,2,2,2,2,  // d8 - df
    3,3,3,3,3,3,3,3,  // e0 - e7
    3,3,3,3,3,4,4,4,  // e8 - ef
    4,4,4,4,4,4,4,4,  // f0 - f7
    4,4,4,4,4,0,0,0   // f8 - ff
];

with( jschardet.Constants )
jschardet.SJIS_st = [
    error,start,start,    3,error,error,error,error, //00-07
    error,error,error,error,itsMe,itsMe,itsMe,itsMe, //08-0f
    itsMe,itsMe,error,error,start,start,start,start  //10-17
];

jschardet.SJISCharLenTable = [0, 1, 1, 2, 0, 0];

jschardet.SJISSMModel = {
    "classTable"    : jschardet.SJIS_cls,
    "classFactor"   : 6,
    "stateTable"    : jschardet.SJIS_st,
    "charLenTable"  : jschardet.SJISCharLenTable,
    "name"          : "Shift_JIS"
};

//UCS2-BE

UCS2BE_cls = [
    0,0,0,0,0,0,0,0,  // 00 - 07
    0,0,1,0,0,2,0,0,  // 08 - 0f
    0,0,0,0,0,0,0,0,  // 10 - 17
    0,0,0,3,0,0,0,0,  // 18 - 1f
    0,0,0,0,0,0,0,0,  // 20 - 27
    0,3,3,3,3,3,0,0,  // 28 - 2f
    0,0,0,0,0,0,0,0,  // 30 - 37
    0,0,0,0,0,0,0,0,  // 38 - 3f
    0,0,0,0,0,0,0,0,  // 40 - 47
    0,0,0,0,0,0,0,0,  // 48 - 4f
    0,0,0,0,0,0,0,0,  // 50 - 57
    0,0,0,0,0,0,0,0,  // 58 - 5f
    0,0,0,0,0,0,0,0,  // 60 - 67
    0,0,0,0,0,0,0,0,  // 68 - 6f
    0,0,0,0,0,0,0,0,  // 70 - 77
    0,0,0,0,0,0,0,0,  // 78 - 7f
    0,0,0,0,0,0,0,0,  // 80 - 87
    0,0,0,0,0,0,0,0,  // 88 - 8f
    0,0,0,0,0,0,0,0,  // 90 - 97
    0,0,0,0,0,0,0,0,  // 98 - 9f
    0,0,0,0,0,0,0,0,  // a0 - a7
    0,0,0,0,0,0,0,0,  // a8 - af
    0,0,0,0,0,0,0,0,  // b0 - b7
    0,0,0,0,0,0,0,0,  // b8 - bf
    0,0,0,0,0,0,0,0,  // c0 - c7
    0,0,0,0,0,0,0,0,  // c8 - cf
    0,0,0,0,0,0,0,0,  // d0 - d7
    0,0,0,0,0,0,0,0,  // d8 - df
    0,0,0,0,0,0,0,0,  // e0 - e7
    0,0,0,0,0,0,0,0,  // e8 - ef
    0,0,0,0,0,0,0,0,  // f0 - f7
    0,0,0,0,0,0,4,5   // f8 - ff
];

with( jschardet.Constants )
jschardet.UCS2BE_st  = [
         5,    7,    7,error,    4,    3,error,error, //00-07
     error,error,error,error,itsMe,itsMe,itsMe,itsMe, //08-0f
     itsMe,itsMe,    6,    6,    6,    6,error,error, //10-17
         6,    6,    6,    6,    6,itsMe,    6,    6, //18-1f
         6,    6,    6,    6,    5,    7,    7,error, //20-27
         5,    8,    6,    6,error,    6,    6,    6, //28-2f
         6,    6,    6,    6,error,error,start,start  //30-37
];

jschardet.UCS2BECharLenTable = [2, 2, 2, 0, 2, 2];

jschardet.UCS2BESMModel = {
    "classTable"    : jschardet.UCS2BE_cls,
    "classFactor"   : 6,
    "stateTable"    : jschardet.UCS2BE_st,
    "charLenTable"  : jschardet.UCS2BECharLenTable,
    "name"          : "UTF-16BE"
};

// UCS2-LE

jschardet.UCS2LE_cls = [
    0,0,0,0,0,0,0,0,  // 00 - 07
    0,0,1,0,0,2,0,0,  // 08 - 0f
    0,0,0,0,0,0,0,0,  // 10 - 17
    0,0,0,3,0,0,0,0,  // 18 - 1f
    0,0,0,0,0,0,0,0,  // 20 - 27
    0,3,3,3,3,3,0,0,  // 28 - 2f
    0,0,0,0,0,0,0,0,  // 30 - 37
    0,0,0,0,0,0,0,0,  // 38 - 3f
    0,0,0,0,0,0,0,0,  // 40 - 47
    0,0,0,0,0,0,0,0,  // 48 - 4f
    0,0,0,0,0,0,0,0,  // 50 - 57
    0,0,0,0,0,0,0,0,  // 58 - 5f
    0,0,0,0,0,0,0,0,  // 60 - 67
    0,0,0,0,0,0,0,0,  // 68 - 6f
    0,0,0,0,0,0,0,0,  // 70 - 77
    0,0,0,0,0,0,0,0,  // 78 - 7f
    0,0,0,0,0,0,0,0,  // 80 - 87
    0,0,0,0,0,0,0,0,  // 88 - 8f
    0,0,0,0,0,0,0,0,  // 90 - 97
    0,0,0,0,0,0,0,0,  // 98 - 9f
    0,0,0,0,0,0,0,0,  // a0 - a7
    0,0,0,0,0,0,0,0,  // a8 - af
    0,0,0,0,0,0,0,0,  // b0 - b7
    0,0,0,0,0,0,0,0,  // b8 - bf
    0,0,0,0,0,0,0,0,  // c0 - c7
    0,0,0,0,0,0,0,0,  // c8 - cf
    0,0,0,0,0,0,0,0,  // d0 - d7
    0,0,0,0,0,0,0,0,  // d8 - df
    0,0,0,0,0,0,0,0,  // e0 - e7
    0,0,0,0,0,0,0,0,  // e8 - ef
    0,0,0,0,0,0,0,0,  // f0 - f7
    0,0,0,0,0,0,4,5   // f8 - ff
];

with( jschardet.Constants )
jschardet.UCS2LE_st = [
         6,    6,    7,    6,    4,    3,error,error, //00-07
     error,error,error,error,itsMe,itsMe,itsMe,itsMe, //08-0f
     itsMe,itsMe,    5,    5,    5,error,itsMe,error, //10-17
         5,    5,    5,error,    5,error,    6,    6, //18-1f
         7,    6,    8,    8,    5,    5,    5,error, //20-27
         5,    5,    5,error,error,error,    5,    5, //28-2f
         5,    5,    5,error,    5,error,start,start  //30-37
];

jschardet.UCS2LECharLenTable = [2, 2, 2, 2, 2, 2];

jschardet.UCS2LESMModel = {
    "classTable"    : jschardet.UCS2LE_cls,
    "classFactor"   : 6,
    "stateTable"    : jschardet.UCS2LE_st,
    "charLenTable"  : jschardet.UCS2LECharLenTable,
    "name"          : "UTF-16LE"
};

// UTF-8

jschardet.UTF8_cls = [
    1,1,1,1,1,1,1,1,  // 00 - 07  //allow 0x00 as a legal value
    1,1,1,1,1,1,0,0,  // 08 - 0f
    1,1,1,1,1,1,1,1,  // 10 - 17
    1,1,1,0,1,1,1,1,  // 18 - 1f
    1,1,1,1,1,1,1,1,  // 20 - 27
    1,1,1,1,1,1,1,1,  // 28 - 2f
    1,1,1,1,1,1,1,1,  // 30 - 37
    1,1,1,1,1,1,1,1,  // 38 - 3f
    1,1,1,1,1,1,1,1,  // 40 - 47
    1,1,1,1,1,1,1,1,  // 48 - 4f
    1,1,1,1,1,1,1,1,  // 50 - 57
    1,1,1,1,1,1,1,1,  // 58 - 5f
    1,1,1,1,1,1,1,1,  // 60 - 67
    1,1,1,1,1,1,1,1,  // 68 - 6f
    1,1,1,1,1,1,1,1,  // 70 - 77
    1,1,1,1,1,1,1,1,  // 78 - 7f
    2,2,2,2,3,3,3,3,  // 80 - 87
    4,4,4,4,4,4,4,4,  // 88 - 8f
    4,4,4,4,4,4,4,4,  // 90 - 97
    4,4,4,4,4,4,4,4,  // 98 - 9f
    5,5,5,5,5,5,5,5,  // a0 - a7
    5,5,5,5,5,5,5,5,  // a8 - af
    5,5,5,5,5,5,5,5,  // b0 - b7
    5,5,5,5,5,5,5,5,  // b8 - bf
    0,0,6,6,6,6,6,6,  // c0 - c7
    6,6,6,6,6,6,6,6,  // c8 - cf
    6,6,6,6,6,6,6,6,  // d0 - d7
    6,6,6,6,6,6,6,6,  // d8 - df
    7,8,8,8,8,8,8,8,  // e0 - e7
    8,8,8,8,8,9,8,8,  // e8 - ef
    10,11,11,11,11,11,11,11,  // f0 - f7
    12,13,13,13,14,15,0,0    // f8 - ff
];

with( jschardet.Constants )
jschardet.UTF8_st = [
    error,start,error,error,error,error,    12,  10, //00-07
        9,    11,    8,    7,    6,    5,    4,   3, //08-0f
    error,error,error,error,error,error,error,error, //10-17
    error,error,error,error,error,error,error,error, //18-1f
    itsMe,itsMe,itsMe,itsMe,itsMe,itsMe,itsMe,itsMe, //20-27
    itsMe,itsMe,itsMe,itsMe,itsMe,itsMe,itsMe,itsMe, //28-2f
    error,error,    5,    5,    5,    5,error,error, //30-37
    error,error,error,error,error,error,error,error, //38-3f
    error,error,error,    5,    5,    5,error,error, //40-47
    error,error,error,error,error,error,error,error, //48-4f
    error,error,    7,    7,    7,    7,error,error, //50-57
    error,error,error,error,error,error,error,error, //58-5f
    error,error,error,error,    7,    7,error,error, //60-67
    error,error,error,error,error,error,error,error, //68-6f
    error,error,    9,    9,    9,    9,error,error, //70-77
    error,error,error,error,error,error,error,error, //78-7f
    error,error,error,error,error,    9,error,error, //80-87
    error,error,error,error,error,error,error,error, //88-8f
    error,error,   12,   12,   12,   12,error,error, //90-97
    error,error,error,error,error,error,error,error, //98-9f
    error,error,error,error,error,   12,error,error, //a0-a7
    error,error,error,error,error,error,error,error, //a8-af
    error,error,   12,   12,   12,error,error,error, //b0-b7
    error,error,error,error,error,error,error,error, //b8-bf
    error,error,start,start,start,start,error,error, //c0-c7
    error,error,error,error,error,error,error,error  //c8-cf
];

jschardet.UTF8CharLenTable = [0, 1, 0, 0, 0, 0, 2, 3, 3, 3, 4, 4, 5, 5, 6, 6];

jschardet.UTF8SMModel = {
    "classTable"    : jschardet.UTF8_cls,
    "classFactor"   : 16,
    "stateTable"    : jschardet.UTF8_st,
    "charLenTable"  : jschardet.UTF8CharLenTable,
    "name"          : "UTF-8"
};

/*
 * The Original Code is Mozilla Universal charset detector code.
 *
 * The Initial Developer of the Original Code is
 * Netscape Communications Corporation.
 * Portions created by the Initial Developer are Copyright (C) 2001
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   António Afonso (antonio.afonso gmail.com) - port to JavaScript
 *   Mark Pilgrim - port to Python
 *   Shy Shalom - original C code
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301  USA
 */

jschardet.CharSetProber = function() {
    this.reset = function() {
        this._mState = jschardet.Constants.detecting;
    }

    this.getCharsetName = function() {
        return null;
    }

    this.feed = function(aBuf) {
    }

    this.getState = function() {
        return this._mState;
    }

    this.getConfidence = function() {
        return 0.0;
    }

    this.filterHighBitOnly = function(aBuf) {
        aBuf = aBuf.replace(/[\x00-\x7F]+/g, " ");
        return aBuf;
    }

    this.filterWithoutEnglishLetters = function(aBuf) {
        aBuf = aBuf.replace(/[A-Za-z]+/g, " ");
        return aBuf;
    }

    this.filterWithEnglishLetters = function(aBuf) {
        // TODO
        return aBuf;
    }
}
/*
 * The Original Code is Mozilla Universal charset detector code.
 *
 * The Initial Developer of the Original Code is
 * Netscape Communications Corporation.
 * Portions created by the Initial Developer are Copyright (C) 2001
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   António Afonso (antonio.afonso gmail.com) - port to JavaScript
 *   Mark Pilgrim - port to Python
 *   Shy Shalom - original C code
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301  USA
 */

jschardet.MultiByteCharSetProber = function() {
    jschardet.CharSetProber.apply(this);

    var self = this;

    function init() {
        self._mDistributionAnalyzer = null;
        self._mCodingSM = null;
        //self._mLastChar = ["\x00", "\x00"];
        self._mLastChar = "\x00\x00";
    }

    this.reset = function() {
        jschardet.MultiByteCharSetProber.prototype.reset.apply(this);
        if( this._mCodingSM ) {
            this._mCodingSM.reset();
        }
        if( this._mDistributionAnalyzer ) {
            this._mDistributionAnalyzer.reset();
        }
        //this._mLastChar = ["\x00", "\x00"];
        this._mLastChar = "\x00\x00";
    }

    this.getCharsetName = function() {
    }

    this.feed = function(aBuf) {
        var aLen = aBuf.length;
        for( var i = 0; i < aLen; i++ ) {
            var codingState = this._mCodingSM.nextState(aBuf[i]);
            if( codingState == jschardet.Constants.error ) {
                if( jschardet.Constants._debug ) {
                    console.log(this.getCharsetName() + " prober hit error at byte " + i + "\n");
                }
                this._mState = jschardet.Constants.notMe;
                break;
            } else if( codingState == jschardet.Constants.itsMe ) {
                this._mState = jschardet.Constants.foundIt;
                break;
            } else if( codingState == jschardet.Constants.start ) {
                var charLen = this._mCodingSM.getCurrentCharLen();
                if( i == 0 ) {
                    this._mLastChar[1] = aBuf[0];
                    this._mDistributionAnalyzer.feed(this._mLastChar, charLen);
                } else {
                    this._mDistributionAnalyzer.feed(aBuf.slice(i-1,i+1), charLen);
                }
            }
        }

        this._mLastChar[0] = aBuf[aLen - 1];

        if( this.getState() == jschardet.Constants.detecting ) {
            if( this._mDistributionAnalyzer.gotEnoughData() &&
                this.getConfidence() > jschardet.Constants.SHORTCUT_THRESHOLD ) {
                this._mState = jschardet.Constants.foundIt;
            }
        }

        return this.getState();
    }

    this.getConfidence = function() {
        return this._mDistributionAnalyzer.getConfidence();
    }
}
jschardet.MultiByteCharSetProber.prototype = new jschardet.CharSetProber();
/*
 * The Original Code is Mozilla Universal charset detector code.
 *
 * The Initial Developer of the Original Code is
 * Netscape Communications Corporation.
 * Portions created by the Initial Developer are Copyright (C) 2001
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   António Afonso (antonio.afonso gmail.com) - port to JavaScript
 *   Mark Pilgrim - port to Python
 *   Shy Shalom - original C code
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301  USA
 */

// Sampling from about 20M text materials include literature and computer technology
//
// Japanese frequency table, applied to both S-JIS and EUC-JP
// They are sorted in order.
//
// 128  --> 0.77094
// 256  --> 0.85710
// 512  --> 0.92635
// 1024 --> 0.97130
// 2048 --> 0.99431
//
// Ideal Distribution Ratio = 0.92635 / (1-0.92635) = 12.58
// Random Distribution Ration = 512 / (2965+62+83+86-512) = 0.191
//
// Typical Distribution Ratio, 25% of IDR

jschardet.JIS_TYPICAL_DISTRIBUTION_RATIO = 3.0;

jschardet.JIS_TABLE_SIZE = 4368;

jschardet.JISCharToFreqOrder = [
  40,   1,   6, 182, 152, 180, 295,2127, 285, 381,3295,4304,3068,4606,3165,3510, //   16
3511,1822,2785,4607,1193,2226,5070,4608, 171,2996,1247,  18, 179,5071, 856,1661, //   32
1262,5072, 619, 127,3431,3512,3230,1899,1700, 232, 228,1294,1298, 284, 283,2041, //   48
2042,1061,1062,  48,  49,  44,  45, 433, 434,1040,1041, 996, 787,2997,1255,4305, //   64
2108,4609,1684,1648,5073,5074,5075,5076,5077,5078,3687,5079,4610,5080,3927,3928, //   80
5081,3296,3432, 290,2285,1471,2187,5082,2580,2825,1303,2140,1739,1445,2691,3375, //   96
1691,3297,4306,4307,4611, 452,3376,1182,2713,3688,3069,4308,5083,5084,5085,5086, //  112
5087,5088,5089,5090,5091,5092,5093,5094,5095,5096,5097,5098,5099,5100,5101,5102, //  128
5103,5104,5105,5106,5107,5108,5109,5110,5111,5112,4097,5113,5114,5115,5116,5117, //  144
5118,5119,5120,5121,5122,5123,5124,5125,5126,5127,5128,5129,5130,5131,5132,5133, //  160
5134,5135,5136,5137,5138,5139,5140,5141,5142,5143,5144,5145,5146,5147,5148,5149, //  176
5150,5151,5152,4612,5153,5154,5155,5156,5157,5158,5159,5160,5161,5162,5163,5164, //  192
5165,5166,5167,5168,5169,5170,5171,5172,5173,5174,5175,1472, 598, 618, 820,1205, //  208
1309,1412,1858,1307,1692,5176,5177,5178,5179,5180,5181,5182,1142,1452,1234,1172, //  224
1875,2043,2149,1793,1382,2973, 925,2404,1067,1241, 960,1377,2935,1491, 919,1217, //  240
1865,2030,1406,1499,2749,4098,5183,5184,5185,5186,5187,5188,2561,4099,3117,1804, //  256
2049,3689,4309,3513,1663,5189,3166,3118,3298,1587,1561,3433,5190,3119,1625,2998, //  272
3299,4613,1766,3690,2786,4614,5191,5192,5193,5194,2161,  26,3377,   2,3929,  20, //  288
3691,  47,4100,  50,  17,  16,  35, 268,  27, 243,  42, 155,  24, 154,  29, 184, //  304
   4,  91,  14,  92,  53, 396,  33, 289,   9,  37,  64, 620,  21,  39, 321,   5, //  320
  12,  11,  52,  13,   3, 208, 138,   0,   7,  60, 526, 141, 151,1069, 181, 275, //  336
1591,  83, 132,1475, 126, 331, 829,  15,  69, 160,  59,  22, 157,  55,1079, 312, //  352
 109,  38,  23,  25,  10,  19,  79,5195,  61, 382,1124,   8,  30,5196,5197,5198, //  368
5199,5200,5201,5202,5203,5204,5205,5206,  89,  62,  74,  34,2416, 112, 139, 196, //  384
 271, 149,  84, 607, 131, 765,  46,  88, 153, 683,  76, 874, 101, 258,  57,  80, //  400
  32, 364, 121,1508, 169,1547,  68, 235, 145,2999,  41, 360,3027,  70,  63,  31, //  416
  43, 259, 262,1383,  99, 533, 194,  66,  93, 846, 217, 192,  56, 106,  58, 565, //  432
 280, 272, 311, 256, 146,  82, 308,  71, 100, 128, 214, 655, 110, 261, 104,1140, //  448
  54,  51,  36,  87,  67,3070, 185,2618,2936,2020,  28,1066,2390,2059,5207,5208, //  464
5209,5210,5211,5212,5213,5214,5215,5216,4615,5217,5218,5219,5220,5221,5222,5223, //  480
5224,5225,5226,5227,5228,5229,5230,5231,5232,5233,5234,5235,5236,3514,5237,5238, //  496
5239,5240,5241,5242,5243,5244,2297,2031,4616,4310,3692,5245,3071,5246,3598,5247, //  512
4617,3231,3515,5248,4101,4311,4618,3808,4312,4102,5249,4103,4104,3599,5250,5251, //  528
5252,5253,5254,5255,5256,5257,5258,5259,5260,5261,5262,5263,5264,5265,5266,5267, //  544
5268,5269,5270,5271,5272,5273,5274,5275,5276,5277,5278,5279,5280,5281,5282,5283, //  560
5284,5285,5286,5287,5288,5289,5290,5291,5292,5293,5294,5295,5296,5297,5298,5299, //  576
5300,5301,5302,5303,5304,5305,5306,5307,5308,5309,5310,5311,5312,5313,5314,5315, //  592
5316,5317,5318,5319,5320,5321,5322,5323,5324,5325,5326,5327,5328,5329,5330,5331, //  608
5332,5333,5334,5335,5336,5337,5338,5339,5340,5341,5342,5343,5344,5345,5346,5347, //  624
5348,5349,5350,5351,5352,5353,5354,5355,5356,5357,5358,5359,5360,5361,5362,5363, //  640
5364,5365,5366,5367,5368,5369,5370,5371,5372,5373,5374,5375,5376,5377,5378,5379, //  656
5380,5381, 363, 642,2787,2878,2788,2789,2316,3232,2317,3434,2011, 165,1942,3930, //  672
3931,3932,3933,5382,4619,5383,4620,5384,5385,5386,5387,5388,5389,5390,5391,5392, //  688
5393,5394,5395,5396,5397,5398,5399,5400,5401,5402,5403,5404,5405,5406,5407,5408, //  704
5409,5410,5411,5412,5413,5414,5415,5416,5417,5418,5419,5420,5421,5422,5423,5424, //  720
5425,5426,5427,5428,5429,5430,5431,5432,5433,5434,5435,5436,5437,5438,5439,5440, //  736
5441,5442,5443,5444,5445,5446,5447,5448,5449,5450,5451,5452,5453,5454,5455,5456, //  752
5457,5458,5459,5460,5461,5462,5463,5464,5465,5466,5467,5468,5469,5470,5471,5472, //  768
5473,5474,5475,5476,5477,5478,5479,5480,5481,5482,5483,5484,5485,5486,5487,5488, //  784
5489,5490,5491,5492,5493,5494,5495,5496,5497,5498,5499,5500,5501,5502,5503,5504, //  800
5505,5506,5507,5508,5509,5510,5511,5512,5513,5514,5515,5516,5517,5518,5519,5520, //  816
5521,5522,5523,5524,5525,5526,5527,5528,5529,5530,5531,5532,5533,5534,5535,5536, //  832
5537,5538,5539,5540,5541,5542,5543,5544,5545,5546,5547,5548,5549,5550,5551,5552, //  848
5553,5554,5555,5556,5557,5558,5559,5560,5561,5562,5563,5564,5565,5566,5567,5568, //  864
5569,5570,5571,5572,5573,5574,5575,5576,5577,5578,5579,5580,5581,5582,5583,5584, //  880
5585,5586,5587,5588,5589,5590,5591,5592,5593,5594,5595,5596,5597,5598,5599,5600, //  896
5601,5602,5603,5604,5605,5606,5607,5608,5609,5610,5611,5612,5613,5614,5615,5616, //  912
5617,5618,5619,5620,5621,5622,5623,5624,5625,5626,5627,5628,5629,5630,5631,5632, //  928
5633,5634,5635,5636,5637,5638,5639,5640,5641,5642,5643,5644,5645,5646,5647,5648, //  944
5649,5650,5651,5652,5653,5654,5655,5656,5657,5658,5659,5660,5661,5662,5663,5664, //  960
5665,5666,5667,5668,5669,5670,5671,5672,5673,5674,5675,5676,5677,5678,5679,5680, //  976
5681,5682,5683,5684,5685,5686,5687,5688,5689,5690,5691,5692,5693,5694,5695,5696, //  992
5697,5698,5699,5700,5701,5702,5703,5704,5705,5706,5707,5708,5709,5710,5711,5712, // 1008
5713,5714,5715,5716,5717,5718,5719,5720,5721,5722,5723,5724,5725,5726,5727,5728, // 1024
5729,5730,5731,5732,5733,5734,5735,5736,5737,5738,5739,5740,5741,5742,5743,5744, // 1040
5745,5746,5747,5748,5749,5750,5751,5752,5753,5754,5755,5756,5757,5758,5759,5760, // 1056
5761,5762,5763,5764,5765,5766,5767,5768,5769,5770,5771,5772,5773,5774,5775,5776, // 1072
5777,5778,5779,5780,5781,5782,5783,5784,5785,5786,5787,5788,5789,5790,5791,5792, // 1088
5793,5794,5795,5796,5797,5798,5799,5800,5801,5802,5803,5804,5805,5806,5807,5808, // 1104
5809,5810,5811,5812,5813,5814,5815,5816,5817,5818,5819,5820,5821,5822,5823,5824, // 1120
5825,5826,5827,5828,5829,5830,5831,5832,5833,5834,5835,5836,5837,5838,5839,5840, // 1136
5841,5842,5843,5844,5845,5846,5847,5848,5849,5850,5851,5852,5853,5854,5855,5856, // 1152
5857,5858,5859,5860,5861,5862,5863,5864,5865,5866,5867,5868,5869,5870,5871,5872, // 1168
5873,5874,5875,5876,5877,5878,5879,5880,5881,5882,5883,5884,5885,5886,5887,5888, // 1184
5889,5890,5891,5892,5893,5894,5895,5896,5897,5898,5899,5900,5901,5902,5903,5904, // 1200
5905,5906,5907,5908,5909,5910,5911,5912,5913,5914,5915,5916,5917,5918,5919,5920, // 1216
5921,5922,5923,5924,5925,5926,5927,5928,5929,5930,5931,5932,5933,5934,5935,5936, // 1232
5937,5938,5939,5940,5941,5942,5943,5944,5945,5946,5947,5948,5949,5950,5951,5952, // 1248
5953,5954,5955,5956,5957,5958,5959,5960,5961,5962,5963,5964,5965,5966,5967,5968, // 1264
5969,5970,5971,5972,5973,5974,5975,5976,5977,5978,5979,5980,5981,5982,5983,5984, // 1280
5985,5986,5987,5988,5989,5990,5991,5992,5993,5994,5995,5996,5997,5998,5999,6000, // 1296
6001,6002,6003,6004,6005,6006,6007,6008,6009,6010,6011,6012,6013,6014,6015,6016, // 1312
6017,6018,6019,6020,6021,6022,6023,6024,6025,6026,6027,6028,6029,6030,6031,6032, // 1328
6033,6034,6035,6036,6037,6038,6039,6040,6041,6042,6043,6044,6045,6046,6047,6048, // 1344
6049,6050,6051,6052,6053,6054,6055,6056,6057,6058,6059,6060,6061,6062,6063,6064, // 1360
6065,6066,6067,6068,6069,6070,6071,6072,6073,6074,6075,6076,6077,6078,6079,6080, // 1376
6081,6082,6083,6084,6085,6086,6087,6088,6089,6090,6091,6092,6093,6094,6095,6096, // 1392
6097,6098,6099,6100,6101,6102,6103,6104,6105,6106,6107,6108,6109,6110,6111,6112, // 1408
6113,6114,2044,2060,4621, 997,1235, 473,1186,4622, 920,3378,6115,6116, 379,1108, // 1424
4313,2657,2735,3934,6117,3809, 636,3233, 573,1026,3693,3435,2974,3300,2298,4105, // 1440
 854,2937,2463, 393,2581,2417, 539, 752,1280,2750,2480, 140,1161, 440, 708,1569, // 1456
 665,2497,1746,1291,1523,3000, 164,1603, 847,1331, 537,1997, 486, 508,1693,2418, // 1472
1970,2227, 878,1220, 299,1030, 969, 652,2751, 624,1137,3301,2619,  65,3302,2045, // 1488
1761,1859,3120,1930,3694,3516, 663,1767, 852, 835,3695, 269, 767,2826,2339,1305, // 1504
 896,1150, 770,1616,6118, 506,1502,2075,1012,2519, 775,2520,2975,2340,2938,4314, // 1520
3028,2086,1224,1943,2286,6119,3072,4315,2240,1273,1987,3935,1557, 175, 597, 985, // 1536
3517,2419,2521,1416,3029, 585, 938,1931,1007,1052,1932,1685,6120,3379,4316,4623, // 1552
 804, 599,3121,1333,2128,2539,1159,1554,2032,3810, 687,2033,2904, 952, 675,1467, // 1568
3436,6121,2241,1096,1786,2440,1543,1924, 980,1813,2228, 781,2692,1879, 728,1918, // 1584
3696,4624, 548,1950,4625,1809,1088,1356,3303,2522,1944, 502, 972, 373, 513,2827, // 1600
 586,2377,2391,1003,1976,1631,6122,2464,1084, 648,1776,4626,2141, 324, 962,2012, // 1616
2177,2076,1384, 742,2178,1448,1173,1810, 222, 102, 301, 445, 125,2420, 662,2498, // 1632
 277, 200,1476,1165,1068, 224,2562,1378,1446, 450,1880, 659, 791, 582,4627,2939, // 1648
3936,1516,1274, 555,2099,3697,1020,1389,1526,3380,1762,1723,1787,2229, 412,2114, // 1664
1900,2392,3518, 512,2597, 427,1925,2341,3122,1653,1686,2465,2499, 697, 330, 273, // 1680
 380,2162, 951, 832, 780, 991,1301,3073, 965,2270,3519, 668,2523,2636,1286, 535, // 1696
1407, 518, 671, 957,2658,2378, 267, 611,2197,3030,6123, 248,2299, 967,1799,2356, // 1712
 850,1418,3437,1876,1256,1480,2828,1718,6124,6125,1755,1664,2405,6126,4628,2879, // 1728
2829, 499,2179, 676,4629, 557,2329,2214,2090, 325,3234, 464, 811,3001, 992,2342, // 1744
2481,1232,1469, 303,2242, 466,1070,2163, 603,1777,2091,4630,2752,4631,2714, 322, // 1760
2659,1964,1768, 481,2188,1463,2330,2857,3600,2092,3031,2421,4632,2318,2070,1849, // 1776
2598,4633,1302,2254,1668,1701,2422,3811,2905,3032,3123,2046,4106,1763,1694,4634, // 1792
1604, 943,1724,1454, 917, 868,2215,1169,2940, 552,1145,1800,1228,1823,1955, 316, // 1808
1080,2510, 361,1807,2830,4107,2660,3381,1346,1423,1134,4108,6127, 541,1263,1229, // 1824
1148,2540, 545, 465,1833,2880,3438,1901,3074,2482, 816,3937, 713,1788,2500, 122, // 1840
1575, 195,1451,2501,1111,6128, 859, 374,1225,2243,2483,4317, 390,1033,3439,3075, // 1856
2524,1687, 266, 793,1440,2599, 946, 779, 802, 507, 897,1081, 528,2189,1292, 711, // 1872
1866,1725,1167,1640, 753, 398,2661,1053, 246, 348,4318, 137,1024,3440,1600,2077, // 1888
2129, 825,4319, 698, 238, 521, 187,2300,1157,2423,1641,1605,1464,1610,1097,2541, // 1904
1260,1436, 759,2255,1814,2150, 705,3235, 409,2563,3304, 561,3033,2005,2564, 726, // 1920
1956,2343,3698,4109, 949,3812,3813,3520,1669, 653,1379,2525, 881,2198, 632,2256, // 1936
1027, 778,1074, 733,1957, 514,1481,2466, 554,2180, 702,3938,1606,1017,1398,6129, // 1952
1380,3521, 921, 993,1313, 594, 449,1489,1617,1166, 768,1426,1360, 495,1794,3601, // 1968
1177,3602,1170,4320,2344, 476, 425,3167,4635,3168,1424, 401,2662,1171,3382,1998, // 1984
1089,4110, 477,3169, 474,6130,1909, 596,2831,1842, 494, 693,1051,1028,1207,3076, // 2000
 606,2115, 727,2790,1473,1115, 743,3522, 630, 805,1532,4321,2021, 366,1057, 838, // 2016
 684,1114,2142,4322,2050,1492,1892,1808,2271,3814,2424,1971,1447,1373,3305,1090, // 2032
1536,3939,3523,3306,1455,2199, 336, 369,2331,1035, 584,2393, 902, 718,2600,6131, // 2048
2753, 463,2151,1149,1611,2467, 715,1308,3124,1268, 343,1413,3236,1517,1347,2663, // 2064
2093,3940,2022,1131,1553,2100,2941,1427,3441,2942,1323,2484,6132,1980, 872,2368, // 2080
2441,2943, 320,2369,2116,1082, 679,1933,3941,2791,3815, 625,1143,2023, 422,2200, // 2096
3816,6133, 730,1695, 356,2257,1626,2301,2858,2637,1627,1778, 937, 883,2906,2693, // 2112
3002,1769,1086, 400,1063,1325,3307,2792,4111,3077, 456,2345,1046, 747,6134,1524, // 2128
 884,1094,3383,1474,2164,1059, 974,1688,2181,2258,1047, 345,1665,1187, 358, 875, // 2144
3170, 305, 660,3524,2190,1334,1135,3171,1540,1649,2542,1527, 927, 968,2793, 885, // 2160
1972,1850, 482, 500,2638,1218,1109,1085,2543,1654,2034, 876,  78,2287,1482,1277, // 2176
 861,1675,1083,1779, 724,2754, 454, 397,1132,1612,2332, 893, 672,1237, 257,2259, // 2192
2370, 135,3384, 337,2244, 547, 352, 340, 709,2485,1400, 788,1138,2511, 540, 772, // 2208
1682,2260,2272,2544,2013,1843,1902,4636,1999,1562,2288,4637,2201,1403,1533, 407, // 2224
 576,3308,1254,2071, 978,3385, 170, 136,1201,3125,2664,3172,2394, 213, 912, 873, // 2240
3603,1713,2202, 699,3604,3699, 813,3442, 493, 531,1054, 468,2907,1483, 304, 281, // 2256
4112,1726,1252,2094, 339,2319,2130,2639, 756,1563,2944, 748, 571,2976,1588,2425, // 2272
2715,1851,1460,2426,1528,1392,1973,3237, 288,3309, 685,3386, 296, 892,2716,2216, // 2288
1570,2245, 722,1747,2217, 905,3238,1103,6135,1893,1441,1965, 251,1805,2371,3700, // 2304
2601,1919,1078,  75,2182,1509,1592,1270,2640,4638,2152,6136,3310,3817, 524, 706, // 2320
1075, 292,3818,1756,2602, 317,  98,3173,3605,3525,1844,2218,3819,2502, 814, 567, // 2336
 385,2908,1534,6137, 534,1642,3239, 797,6138,1670,1529, 953,4323, 188,1071, 538, // 2352
 178, 729,3240,2109,1226,1374,2000,2357,2977, 731,2468,1116,2014,2051,6139,1261, // 2368
1593, 803,2859,2736,3443, 556, 682, 823,1541,6140,1369,2289,1706,2794, 845, 462, // 2384
2603,2665,1361, 387, 162,2358,1740, 739,1770,1720,1304,1401,3241,1049, 627,1571, // 2400
2427,3526,1877,3942,1852,1500, 431,1910,1503, 677, 297,2795, 286,1433,1038,1198, // 2416
2290,1133,1596,4113,4639,2469,1510,1484,3943,6141,2442, 108, 712,4640,2372, 866, // 2432
3701,2755,3242,1348, 834,1945,1408,3527,2395,3243,1811, 824, 994,1179,2110,1548, // 2448
1453, 790,3003, 690,4324,4325,2832,2909,3820,1860,3821, 225,1748, 310, 346,1780, // 2464
2470, 821,1993,2717,2796, 828, 877,3528,2860,2471,1702,2165,2910,2486,1789, 453, // 2480
 359,2291,1676,  73,1164,1461,1127,3311, 421, 604, 314,1037, 589, 116,2487, 737, // 2496
 837,1180, 111, 244, 735,6142,2261,1861,1362, 986, 523, 418, 581,2666,3822, 103, // 2512
 855, 503,1414,1867,2488,1091, 657,1597, 979, 605,1316,4641,1021,2443,2078,2001, // 2528
1209,  96, 587,2166,1032, 260,1072,2153, 173,  94, 226,3244, 819,2006,4642,4114, // 2544
2203, 231,1744, 782,  97,2667, 786,3387, 887, 391, 442,2219,4326,1425,6143,2694, // 2560
 633,1544,1202, 483,2015, 592,2052,1958,2472,1655, 419, 129,4327,3444,3312,1714, // 2576
1257,3078,4328,1518,1098, 865,1310,1019,1885,1512,1734, 469,2444, 148, 773, 436, // 2592
1815,1868,1128,1055,4329,1245,2756,3445,2154,1934,1039,4643, 579,1238, 932,2320, // 2608
 353, 205, 801, 115,2428, 944,2321,1881, 399,2565,1211, 678, 766,3944, 335,2101, // 2624
1459,1781,1402,3945,2737,2131,1010, 844, 981,1326,1013, 550,1816,1545,2620,1335, // 2640
1008, 371,2881, 936,1419,1613,3529,1456,1395,2273,1834,2604,1317,2738,2503, 416, // 2656
1643,4330, 806,1126, 229, 591,3946,1314,1981,1576,1837,1666, 347,1790, 977,3313, // 2672
 764,2861,1853, 688,2429,1920,1462,  77, 595, 415,2002,3034, 798,1192,4115,6144, // 2688
2978,4331,3035,2695,2582,2072,2566, 430,2430,1727, 842,1396,3947,3702, 613, 377, // 2704
 278, 236,1417,3388,3314,3174, 757,1869, 107,3530,6145,1194, 623,2262, 207,1253, // 2720
2167,3446,3948, 492,1117,1935, 536,1838,2757,1246,4332, 696,2095,2406,1393,1572, // 2736
3175,1782, 583, 190, 253,1390,2230, 830,3126,3389, 934,3245,1703,1749,2979,1870, // 2752
2545,1656,2204, 869,2346,4116,3176,1817, 496,1764,4644, 942,1504, 404,1903,1122, // 2768
1580,3606,2945,1022, 515, 372,1735, 955,2431,3036,6146,2797,1110,2302,2798, 617, // 2784
6147, 441, 762,1771,3447,3607,3608,1904, 840,3037,  86, 939,1385, 572,1370,2445, // 2800
1336, 114,3703, 898, 294, 203,3315, 703,1583,2274, 429, 961,4333,1854,1951,3390, // 2816
2373,3704,4334,1318,1381, 966,1911,2322,1006,1155, 309, 989, 458,2718,1795,1372, // 2832
1203, 252,1689,1363,3177, 517,1936, 168,1490, 562, 193,3823,1042,4117,1835, 551, // 2848
 470,4645, 395, 489,3448,1871,1465,2583,2641, 417,1493, 279,1295, 511,1236,1119, // 2864
  72,1231,1982,1812,3004, 871,1564, 984,3449,1667,2696,2096,4646,2347,2833,1673, // 2880
3609, 695,3246,2668, 807,1183,4647, 890, 388,2333,1801,1457,2911,1765,1477,1031, // 2896
3316,3317,1278,3391,2799,2292,2526, 163,3450,4335,2669,1404,1802,6148,2323,2407, // 2912
1584,1728,1494,1824,1269, 298, 909,3318,1034,1632, 375, 776,1683,2061, 291, 210, // 2928
1123, 809,1249,1002,2642,3038, 206,1011,2132, 144, 975, 882,1565, 342, 667, 754, // 2944
1442,2143,1299,2303,2062, 447, 626,2205,1221,2739,2912,1144,1214,2206,2584, 760, // 2960
1715, 614, 950,1281,2670,2621, 810, 577,1287,2546,4648, 242,2168, 250,2643, 691, // 2976
 123,2644, 647, 313,1029, 689,1357,2946,1650, 216, 771,1339,1306, 808,2063, 549, // 2992
 913,1371,2913,2914,6149,1466,1092,1174,1196,1311,2605,2396,1783,1796,3079, 406, // 3008
2671,2117,3949,4649, 487,1825,2220,6150,2915, 448,2348,1073,6151,2397,1707, 130, // 3024
 900,1598, 329, 176,1959,2527,1620,6152,2275,4336,3319,1983,2191,3705,3610,2155, // 3040
3706,1912,1513,1614,6153,1988, 646, 392,2304,1589,3320,3039,1826,1239,1352,1340, // 3056
2916, 505,2567,1709,1437,2408,2547, 906,6154,2672, 384,1458,1594,1100,1329, 710, // 3072
 423,3531,2064,2231,2622,1989,2673,1087,1882, 333, 841,3005,1296,2882,2379, 580, // 3088
1937,1827,1293,2585, 601, 574, 249,1772,4118,2079,1120, 645, 901,1176,1690, 795, // 3104
2207, 478,1434, 516,1190,1530, 761,2080, 930,1264, 355, 435,1552, 644,1791, 987, // 3120
 220,1364,1163,1121,1538, 306,2169,1327,1222, 546,2645, 218, 241, 610,1704,3321, // 3136
1984,1839,1966,2528, 451,6155,2586,3707,2568, 907,3178, 254,2947, 186,1845,4650, // 3152
 745, 432,1757, 428,1633, 888,2246,2221,2489,3611,2118,1258,1265, 956,3127,1784, // 3168
4337,2490, 319, 510, 119, 457,3612, 274,2035,2007,4651,1409,3128, 970,2758, 590, // 3184
2800, 661,2247,4652,2008,3950,1420,1549,3080,3322,3951,1651,1375,2111, 485,2491, // 3200
1429,1156,6156,2548,2183,1495, 831,1840,2529,2446, 501,1657, 307,1894,3247,1341, // 3216
 666, 899,2156,1539,2549,1559, 886, 349,2208,3081,2305,1736,3824,2170,2759,1014, // 3232
1913,1386, 542,1397,2948, 490, 368, 716, 362, 159, 282,2569,1129,1658,1288,1750, // 3248
2674, 276, 649,2016, 751,1496, 658,1818,1284,1862,2209,2087,2512,3451, 622,2834, // 3264
 376, 117,1060,2053,1208,1721,1101,1443, 247,1250,3179,1792,3952,2760,2398,3953, // 3280
6157,2144,3708, 446,2432,1151,2570,3452,2447,2761,2835,1210,2448,3082, 424,2222, // 3296
1251,2449,2119,2836, 504,1581,4338, 602, 817, 857,3825,2349,2306, 357,3826,1470, // 3312
1883,2883, 255, 958, 929,2917,3248, 302,4653,1050,1271,1751,2307,1952,1430,2697, // 3328
2719,2359, 354,3180, 777, 158,2036,4339,1659,4340,4654,2308,2949,2248,1146,2232, // 3344
3532,2720,1696,2623,3827,6158,3129,1550,2698,1485,1297,1428, 637, 931,2721,2145, // 3360
 914,2550,2587,  81,2450, 612, 827,2646,1242,4655,1118,2884, 472,1855,3181,3533, // 3376
3534, 569,1353,2699,1244,1758,2588,4119,2009,2762,2171,3709,1312,1531,6159,1152, // 3392
1938, 134,1830, 471,3710,2276,1112,1535,3323,3453,3535, 982,1337,2950, 488, 826, // 3408
 674,1058,1628,4120,2017, 522,2399, 211, 568,1367,3454, 350, 293,1872,1139,3249, // 3424
1399,1946,3006,1300,2360,3324, 588, 736,6160,2606, 744, 669,3536,3828,6161,1358, // 3440
 199, 723, 848, 933, 851,1939,1505,1514,1338,1618,1831,4656,1634,3613, 443,2740, // 3456
3829, 717,1947, 491,1914,6162,2551,1542,4121,1025,6163,1099,1223, 198,3040,2722, // 3472
 370, 410,1905,2589, 998,1248,3182,2380, 519,1449,4122,1710, 947, 928,1153,4341, // 3488
2277, 344,2624,1511, 615, 105, 161,1212,1076,1960,3130,2054,1926,1175,1906,2473, // 3504
 414,1873,2801,6164,2309, 315,1319,3325, 318,2018,2146,2157, 963, 631, 223,4342, // 3520
4343,2675, 479,3711,1197,2625,3712,2676,2361,6165,4344,4123,6166,2451,3183,1886, // 3536
2184,1674,1330,1711,1635,1506, 799, 219,3250,3083,3954,1677,3713,3326,2081,3614, // 3552
1652,2073,4657,1147,3041,1752, 643,1961, 147,1974,3955,6167,1716,2037, 918,3007, // 3568
1994, 120,1537, 118, 609,3184,4345, 740,3455,1219, 332,1615,3830,6168,1621,2980, // 3584
1582, 783, 212, 553,2350,3714,1349,2433,2082,4124, 889,6169,2310,1275,1410, 973, // 3600
 166,1320,3456,1797,1215,3185,2885,1846,2590,2763,4658, 629, 822,3008, 763, 940, // 3616
1990,2862, 439,2409,1566,1240,1622, 926,1282,1907,2764, 654,2210,1607, 327,1130, // 3632
3956,1678,1623,6170,2434,2192, 686, 608,3831,3715, 903,3957,3042,6171,2741,1522, // 3648
1915,1105,1555,2552,1359, 323,3251,4346,3457, 738,1354,2553,2311,2334,1828,2003, // 3664
3832,1753,2351,1227,6172,1887,4125,1478,6173,2410,1874,1712,1847, 520,1204,2607, // 3680
 264,4659, 836,2677,2102, 600,4660,3833,2278,3084,6174,4347,3615,1342, 640, 532, // 3696
 543,2608,1888,2400,2591,1009,4348,1497, 341,1737,3616,2723,1394, 529,3252,1321, // 3712
 983,4661,1515,2120, 971,2592, 924, 287,1662,3186,4349,2700,4350,1519, 908,1948, // 3728
2452, 156, 796,1629,1486,2223,2055, 694,4126,1259,1036,3392,1213,2249,2742,1889, // 3744
1230,3958,1015, 910, 408, 559,3617,4662, 746, 725, 935,4663,3959,3009,1289, 563, // 3760
 867,4664,3960,1567,2981,2038,2626, 988,2263,2381,4351, 143,2374, 704,1895,6175, // 3776
1188,3716,2088, 673,3085,2362,4352, 484,1608,1921,2765,2918, 215, 904,3618,3537, // 3792
 894, 509, 976,3043,2701,3961,4353,2837,2982, 498,6176,6177,1102,3538,1332,3393, // 3808
1487,1636,1637, 233, 245,3962, 383, 650, 995,3044, 460,1520,1206,2352, 749,3327, // 3824
 530, 700, 389,1438,1560,1773,3963,2264, 719,2951,2724,3834, 870,1832,1644,1000, // 3840
 839,2474,3717, 197,1630,3394, 365,2886,3964,1285,2133, 734, 922, 818,1106, 732, // 3856
 480,2083,1774,3458, 923,2279,1350, 221,3086,  85,2233,2234,3835,1585,3010,2147, // 3872
1387,1705,2382,1619,2475, 133, 239,2802,1991,1016,2084,2383, 411,2838,1113, 651, // 3888
1985,1160,3328, 990,1863,3087,1048,1276,2647, 265,2627,1599,3253,2056, 150, 638, // 3904
2019, 656, 853, 326,1479, 680,1439,4354,1001,1759, 413,3459,3395,2492,1431, 459, // 3920
4355,1125,3329,2265,1953,1450,2065,2863, 849, 351,2678,3131,3254,3255,1104,1577, // 3936
 227,1351,1645,2453,2193,1421,2887, 812,2121, 634,  95,2435, 201,2312,4665,1646, // 3952
1671,2743,1601,2554,2702,2648,2280,1315,1366,2089,3132,1573,3718,3965,1729,1189, // 3968
 328,2679,1077,1940,1136, 558,1283, 964,1195, 621,2074,1199,1743,3460,3619,1896, // 3984
1916,1890,3836,2952,1154,2112,1064, 862, 378,3011,2066,2113,2803,1568,2839,6178, // 4000
3088,2919,1941,1660,2004,1992,2194, 142, 707,1590,1708,1624,1922,1023,1836,1233, // 4016
1004,2313, 789, 741,3620,6179,1609,2411,1200,4127,3719,3720,4666,2057,3721, 593, // 4032
2840, 367,2920,1878,6180,3461,1521, 628,1168, 692,2211,2649, 300, 720,2067,2571, // 4048
2953,3396, 959,2504,3966,3539,3462,1977, 701,6181, 954,1043, 800, 681, 183,3722, // 4064
1803,1730,3540,4128,2103, 815,2314, 174, 467, 230,2454,1093,2134, 755,3541,3397, // 4080
1141,1162,6182,1738,2039, 270,3256,2513,1005,1647,2185,3837, 858,1679,1897,1719, // 4096
2954,2324,1806, 402, 670, 167,4129,1498,2158,2104, 750,6183, 915, 189,1680,1551, // 4112
 455,4356,1501,2455, 405,1095,2955, 338,1586,1266,1819, 570, 641,1324, 237,1556, // 4128
2650,1388,3723,6184,1368,2384,1343,1978,3089,2436, 879,3724, 792,1191, 758,3012, // 4144
1411,2135,1322,4357, 240,4667,1848,3725,1574,6185, 420,3045,1546,1391, 714,4358, // 4160
1967, 941,1864, 863, 664, 426, 560,1731,2680,1785,2864,1949,2363, 403,3330,1415, // 4176
1279,2136,1697,2335, 204, 721,2097,3838,  90,6186,2085,2505, 191,3967, 124,2148, // 4192
1376,1798,1178,1107,1898,1405, 860,4359,1243,1272,2375,2983,1558,2456,1638, 113, // 4208
3621, 578,1923,2609, 880, 386,4130, 784,2186,2266,1422,2956,2172,1722, 497, 263, // 4224
2514,1267,2412,2610, 177,2703,3542, 774,1927,1344, 616,1432,1595,1018, 172,4360, // 4240
2325, 911,4361, 438,1468,3622, 794,3968,2024,2173,1681,1829,2957, 945, 895,3090, // 4256
 575,2212,2476, 475,2401,2681, 785,2744,1745,2293,2555,1975,3133,2865, 394,4668, // 4272
3839, 635,4131, 639, 202,1507,2195,2766,1345,1435,2572,3726,1908,1184,1181,2457, // 4288
3727,3134,4362, 843,2611, 437, 916,4669, 234, 769,1884,3046,3047,3623, 833,6187, // 4304
1639,2250,2402,1355,1185,2010,2047, 999, 525,1732,1290,1488,2612, 948,1578,3728, // 4320
2413,2477,1216,2725,2159, 334,3840,1328,3624,2921,1525,4132, 564,1056, 891,4363, // 4336
1444,1698,2385,2251,3729,1365,2281,2235,1717,6188, 864,3841,2515, 444, 527,2767, // 4352
2922,3625, 544, 461,6189, 566, 209,2437,3398,2098,1065,2068,3331,3626,3257,2137, // 4368  //last 512
//Everything below is of no interest for detection purpose
2138,2122,3730,2888,1995,1820,1044,6190,6191,6192,6193,6194,6195,6196,6197,6198, // 4384
6199,6200,6201,6202,6203,6204,6205,4670,6206,6207,6208,6209,6210,6211,6212,6213, // 4400
6214,6215,6216,6217,6218,6219,6220,6221,6222,6223,6224,6225,6226,6227,6228,6229, // 4416
6230,6231,6232,6233,6234,6235,6236,6237,3187,6238,6239,3969,6240,6241,6242,6243, // 4432
6244,4671,6245,6246,4672,6247,6248,4133,6249,6250,4364,6251,2923,2556,2613,4673, // 4448
4365,3970,6252,6253,6254,6255,4674,6256,6257,6258,2768,2353,4366,4675,4676,3188, // 4464
4367,3463,6259,4134,4677,4678,6260,2267,6261,3842,3332,4368,3543,6262,6263,6264, // 4480
3013,1954,1928,4135,4679,6265,6266,2478,3091,6267,4680,4369,6268,6269,1699,6270, // 4496
3544,4136,4681,6271,4137,6272,4370,2804,6273,6274,2593,3971,3972,4682,6275,2236, // 4512
4683,6276,6277,4684,6278,6279,4138,3973,4685,6280,6281,3258,6282,6283,6284,6285, // 4528
3974,4686,2841,3975,6286,6287,3545,6288,6289,4139,4687,4140,6290,4141,6291,4142, // 4544
6292,6293,3333,6294,6295,6296,4371,6297,3399,6298,6299,4372,3976,6300,6301,6302, // 4560
4373,6303,6304,3843,3731,6305,4688,4374,6306,6307,3259,2294,6308,3732,2530,4143, // 4576
6309,4689,6310,6311,6312,3048,6313,6314,4690,3733,2237,6315,6316,2282,3334,6317, // 4592
6318,3844,6319,6320,4691,6321,3400,4692,6322,4693,6323,3049,6324,4375,6325,3977, // 4608
6326,6327,6328,3546,6329,4694,3335,6330,4695,4696,6331,6332,6333,6334,4376,3978, // 4624
6335,4697,3979,4144,6336,3980,4698,6337,6338,6339,6340,6341,4699,4700,4701,6342, // 4640
6343,4702,6344,6345,4703,6346,6347,4704,6348,4705,4706,3135,6349,4707,6350,4708, // 4656
6351,4377,6352,4709,3734,4145,6353,2506,4710,3189,6354,3050,4711,3981,6355,3547, // 4672
3014,4146,4378,3735,2651,3845,3260,3136,2224,1986,6356,3401,6357,4712,2594,3627, // 4688
3137,2573,3736,3982,4713,3628,4714,4715,2682,3629,4716,6358,3630,4379,3631,6359, // 4704
6360,6361,3983,6362,6363,6364,6365,4147,3846,4717,6366,6367,3737,2842,6368,4718, // 4720
2628,6369,3261,6370,2386,6371,6372,3738,3984,4719,3464,4720,3402,6373,2924,3336, // 4736
4148,2866,6374,2805,3262,4380,2704,2069,2531,3138,2806,2984,6375,2769,6376,4721, // 4752
4722,3403,6377,6378,3548,6379,6380,2705,3092,1979,4149,2629,3337,2889,6381,3338, // 4768
4150,2557,3339,4381,6382,3190,3263,3739,6383,4151,4723,4152,2558,2574,3404,3191, // 4784
6384,6385,4153,6386,4724,4382,6387,6388,4383,6389,6390,4154,6391,4725,3985,6392, // 4800
3847,4155,6393,6394,6395,6396,6397,3465,6398,4384,6399,6400,6401,6402,6403,6404, // 4816
4156,6405,6406,6407,6408,2123,6409,6410,2326,3192,4726,6411,6412,6413,6414,4385, // 4832
4157,6415,6416,4158,6417,3093,3848,6418,3986,6419,6420,3849,6421,6422,6423,4159, // 4848
6424,6425,4160,6426,3740,6427,6428,6429,6430,3987,6431,4727,6432,2238,6433,6434, // 4864
4386,3988,6435,6436,3632,6437,6438,2843,6439,6440,6441,6442,3633,6443,2958,6444, // 4880
6445,3466,6446,2364,4387,3850,6447,4388,2959,3340,6448,3851,6449,4728,6450,6451, // 4896
3264,4729,6452,3193,6453,4389,4390,2706,3341,4730,6454,3139,6455,3194,6456,3051, // 4912
2124,3852,1602,4391,4161,3853,1158,3854,4162,3989,4392,3990,4731,4732,4393,2040, // 4928
4163,4394,3265,6457,2807,3467,3855,6458,6459,6460,3991,3468,4733,4734,6461,3140, // 4944
2960,6462,4735,6463,6464,6465,6466,4736,4737,4738,4739,6467,6468,4164,2403,3856, // 4960
6469,6470,2770,2844,6471,4740,6472,6473,6474,6475,6476,6477,6478,3195,6479,4741, // 4976
4395,6480,2867,6481,4742,2808,6482,2493,4165,6483,6484,6485,6486,2295,4743,6487, // 4992
6488,6489,3634,6490,6491,6492,6493,6494,6495,6496,2985,4744,6497,6498,4745,6499, // 5008
6500,2925,3141,4166,6501,6502,4746,6503,6504,4747,6505,6506,6507,2890,6508,6509, // 5024
6510,6511,6512,6513,6514,6515,6516,6517,6518,6519,3469,4167,6520,6521,6522,4748, // 5040
4396,3741,4397,4749,4398,3342,2125,4750,6523,4751,4752,4753,3052,6524,2961,4168, // 5056
6525,4754,6526,4755,4399,2926,4169,6527,3857,6528,4400,4170,6529,4171,6530,6531, // 5072
2595,6532,6533,6534,6535,3635,6536,6537,6538,6539,6540,6541,6542,4756,6543,6544, // 5088
6545,6546,6547,6548,4401,6549,6550,6551,6552,4402,3405,4757,4403,6553,6554,6555, // 5104
4172,3742,6556,6557,6558,3992,3636,6559,6560,3053,2726,6561,3549,4173,3054,4404, // 5120
6562,6563,3993,4405,3266,3550,2809,4406,6564,6565,6566,4758,4759,6567,3743,6568, // 5136
4760,3744,4761,3470,6569,6570,6571,4407,6572,3745,4174,6573,4175,2810,4176,3196, // 5152
4762,6574,4177,6575,6576,2494,2891,3551,6577,6578,3471,6579,4408,6580,3015,3197, // 5168
6581,3343,2532,3994,3858,6582,3094,3406,4409,6583,2892,4178,4763,4410,3016,4411, // 5184
6584,3995,3142,3017,2683,6585,4179,6586,6587,4764,4412,6588,6589,4413,6590,2986, // 5200
6591,2962,3552,6592,2963,3472,6593,6594,4180,4765,6595,6596,2225,3267,4414,6597, // 5216
3407,3637,4766,6598,6599,3198,6600,4415,6601,3859,3199,6602,3473,4767,2811,4416, // 5232
1856,3268,3200,2575,3996,3997,3201,4417,6603,3095,2927,6604,3143,6605,2268,6606, // 5248
3998,3860,3096,2771,6607,6608,3638,2495,4768,6609,3861,6610,3269,2745,4769,4181, // 5264
3553,6611,2845,3270,6612,6613,6614,3862,6615,6616,4770,4771,6617,3474,3999,4418, // 5280
4419,6618,3639,3344,6619,4772,4182,6620,2126,6621,6622,6623,4420,4773,6624,3018, // 5296
6625,4774,3554,6626,4183,2025,3746,6627,4184,2707,6628,4421,4422,3097,1775,4185, // 5312
3555,6629,6630,2868,6631,6632,4423,6633,6634,4424,2414,2533,2928,6635,4186,2387, // 5328
6636,4775,6637,4187,6638,1891,4425,3202,3203,6639,6640,4776,6641,3345,6642,6643, // 5344
3640,6644,3475,3346,3641,4000,6645,3144,6646,3098,2812,4188,3642,3204,6647,3863, // 5360
3476,6648,3864,6649,4426,4001,6650,6651,6652,2576,6653,4189,4777,6654,6655,6656, // 5376
2846,6657,3477,3205,4002,6658,4003,6659,3347,2252,6660,6661,6662,4778,6663,6664, // 5392
6665,6666,6667,6668,6669,4779,4780,2048,6670,3478,3099,6671,3556,3747,4004,6672, // 5408
6673,6674,3145,4005,3748,6675,6676,6677,6678,6679,3408,6680,6681,6682,6683,3206, // 5424
3207,6684,6685,4781,4427,6686,4782,4783,4784,6687,6688,6689,4190,6690,6691,3479, // 5440
6692,2746,6693,4428,6694,6695,6696,6697,6698,6699,4785,6700,6701,3208,2727,6702, // 5456
3146,6703,6704,3409,2196,6705,4429,6706,6707,6708,2534,1996,6709,6710,6711,2747, // 5472
6712,6713,6714,4786,3643,6715,4430,4431,6716,3557,6717,4432,4433,6718,6719,6720, // 5488
6721,3749,6722,4006,4787,6723,6724,3644,4788,4434,6725,6726,4789,2772,6727,6728, // 5504
6729,6730,6731,2708,3865,2813,4435,6732,6733,4790,4791,3480,6734,6735,6736,6737, // 5520
4436,3348,6738,3410,4007,6739,6740,4008,6741,6742,4792,3411,4191,6743,6744,6745, // 5536
6746,6747,3866,6748,3750,6749,6750,6751,6752,6753,6754,6755,3867,6756,4009,6757, // 5552
4793,4794,6758,2814,2987,6759,6760,6761,4437,6762,6763,6764,6765,3645,6766,6767, // 5568
3481,4192,6768,3751,6769,6770,2174,6771,3868,3752,6772,6773,6774,4193,4795,4438, // 5584
3558,4796,4439,6775,4797,6776,6777,4798,6778,4799,3559,4800,6779,6780,6781,3482, // 5600
6782,2893,6783,6784,4194,4801,4010,6785,6786,4440,6787,4011,6788,6789,6790,6791, // 5616
6792,6793,4802,6794,6795,6796,4012,6797,6798,6799,6800,3349,4803,3483,6801,4804, // 5632
4195,6802,4013,6803,6804,4196,6805,4014,4015,6806,2847,3271,2848,6807,3484,6808, // 5648
6809,6810,4441,6811,4442,4197,4443,3272,4805,6812,3412,4016,1579,6813,6814,4017, // 5664
6815,3869,6816,2964,6817,4806,6818,6819,4018,3646,6820,6821,4807,4019,4020,6822, // 5680
6823,3560,6824,6825,4021,4444,6826,4198,6827,6828,4445,6829,6830,4199,4808,6831, // 5696
6832,6833,3870,3019,2458,6834,3753,3413,3350,6835,4809,3871,4810,3561,4446,6836, // 5712
6837,4447,4811,4812,6838,2459,4448,6839,4449,6840,6841,4022,3872,6842,4813,4814, // 5728
6843,6844,4815,4200,4201,4202,6845,4023,6846,6847,4450,3562,3873,6848,6849,4816, // 5744
4817,6850,4451,4818,2139,6851,3563,6852,6853,3351,6854,6855,3352,4024,2709,3414, // 5760
4203,4452,6856,4204,6857,6858,3874,3875,6859,6860,4819,6861,6862,6863,6864,4453, // 5776
3647,6865,6866,4820,6867,6868,6869,6870,4454,6871,2869,6872,6873,4821,6874,3754, // 5792
6875,4822,4205,6876,6877,6878,3648,4206,4455,6879,4823,6880,4824,3876,6881,3055, // 5808
4207,6882,3415,6883,6884,6885,4208,4209,6886,4210,3353,6887,3354,3564,3209,3485, // 5824
2652,6888,2728,6889,3210,3755,6890,4025,4456,6891,4825,6892,6893,6894,6895,4211, // 5840
6896,6897,6898,4826,6899,6900,4212,6901,4827,6902,2773,3565,6903,4828,6904,6905, // 5856
6906,6907,3649,3650,6908,2849,3566,6909,3567,3100,6910,6911,6912,6913,6914,6915, // 5872
4026,6916,3355,4829,3056,4457,3756,6917,3651,6918,4213,3652,2870,6919,4458,6920, // 5888
2438,6921,6922,3757,2774,4830,6923,3356,4831,4832,6924,4833,4459,3653,2507,6925, // 5904
4834,2535,6926,6927,3273,4027,3147,6928,3568,6929,6930,6931,4460,6932,3877,4461, // 5920
2729,3654,6933,6934,6935,6936,2175,4835,2630,4214,4028,4462,4836,4215,6937,3148, // 5936
4216,4463,4837,4838,4217,6938,6939,2850,4839,6940,4464,6941,6942,6943,4840,6944, // 5952
4218,3274,4465,6945,6946,2710,6947,4841,4466,6948,6949,2894,6950,6951,4842,6952, // 5968
4219,3057,2871,6953,6954,6955,6956,4467,6957,2711,6958,6959,6960,3275,3101,4843, // 5984
6961,3357,3569,6962,4844,6963,6964,4468,4845,3570,6965,3102,4846,3758,6966,4847, // 6000
3878,4848,4849,4029,6967,2929,3879,4850,4851,6968,6969,1733,6970,4220,6971,6972, // 6016
6973,6974,6975,6976,4852,6977,6978,6979,6980,6981,6982,3759,6983,6984,6985,3486, // 6032
3487,6986,3488,3416,6987,6988,6989,6990,6991,6992,6993,6994,6995,6996,6997,4853, // 6048
6998,6999,4030,7000,7001,3211,7002,7003,4221,7004,7005,3571,4031,7006,3572,7007, // 6064
2614,4854,2577,7008,7009,2965,3655,3656,4855,2775,3489,3880,4222,4856,3881,4032, // 6080
3882,3657,2730,3490,4857,7010,3149,7011,4469,4858,2496,3491,4859,2283,7012,7013, // 6096
7014,2365,4860,4470,7015,7016,3760,7017,7018,4223,1917,7019,7020,7021,4471,7022, // 6112
2776,4472,7023,7024,7025,7026,4033,7027,3573,4224,4861,4034,4862,7028,7029,1929, // 6128
3883,4035,7030,4473,3058,7031,2536,3761,3884,7032,4036,7033,2966,2895,1968,4474, // 6144
3276,4225,3417,3492,4226,2105,7034,7035,1754,2596,3762,4227,4863,4475,3763,4864, // 6160
3764,2615,2777,3103,3765,3658,3418,4865,2296,3766,2815,7036,7037,7038,3574,2872, // 6176
3277,4476,7039,4037,4477,7040,7041,4038,7042,7043,7044,7045,7046,7047,2537,7048, // 6192
7049,7050,7051,7052,7053,7054,4478,7055,7056,3767,3659,4228,3575,7057,7058,4229, // 6208
7059,7060,7061,3660,7062,3212,7063,3885,4039,2460,7064,7065,7066,7067,7068,7069, // 6224
7070,7071,7072,7073,7074,4866,3768,4867,7075,7076,7077,7078,4868,3358,3278,2653, // 6240
7079,7080,4479,3886,7081,7082,4869,7083,7084,7085,7086,7087,7088,2538,7089,7090, // 6256
7091,4040,3150,3769,4870,4041,2896,3359,4230,2930,7092,3279,7093,2967,4480,3213, // 6272
4481,3661,7094,7095,7096,7097,7098,7099,7100,7101,7102,2461,3770,7103,7104,4231, // 6288
3151,7105,7106,7107,4042,3662,7108,7109,4871,3663,4872,4043,3059,7110,7111,7112, // 6304
3493,2988,7113,4873,7114,7115,7116,3771,4874,7117,7118,4232,4875,7119,3576,2336, // 6320
4876,7120,4233,3419,4044,4877,4878,4482,4483,4879,4484,4234,7121,3772,4880,1045, // 6336
3280,3664,4881,4882,7122,7123,7124,7125,4883,7126,2778,7127,4485,4486,7128,4884, // 6352
3214,3887,7129,7130,3215,7131,4885,4045,7132,7133,4046,7134,7135,7136,7137,7138, // 6368
7139,7140,7141,7142,7143,4235,7144,4886,7145,7146,7147,4887,7148,7149,7150,4487, // 6384
4047,4488,7151,7152,4888,4048,2989,3888,7153,3665,7154,4049,7155,7156,7157,7158, // 6400
7159,7160,2931,4889,4890,4489,7161,2631,3889,4236,2779,7162,7163,4891,7164,3060, // 6416
7165,1672,4892,7166,4893,4237,3281,4894,7167,7168,3666,7169,3494,7170,7171,4050, // 6432
7172,7173,3104,3360,3420,4490,4051,2684,4052,7174,4053,7175,7176,7177,2253,4054, // 6448
7178,7179,4895,7180,3152,3890,3153,4491,3216,7181,7182,7183,2968,4238,4492,4055, // 6464
7184,2990,7185,2479,7186,7187,4493,7188,7189,7190,7191,7192,4896,7193,4897,2969, // 6480
4494,4898,7194,3495,7195,7196,4899,4495,7197,3105,2731,7198,4900,7199,7200,7201, // 6496
4056,7202,3361,7203,7204,4496,4901,4902,7205,4497,7206,7207,2315,4903,7208,4904, // 6512
7209,4905,2851,7210,7211,3577,7212,3578,4906,7213,4057,3667,4907,7214,4058,2354, // 6528
3891,2376,3217,3773,7215,7216,7217,7218,7219,4498,7220,4908,3282,2685,7221,3496, // 6544
4909,2632,3154,4910,7222,2337,7223,4911,7224,7225,7226,4912,4913,3283,4239,4499, // 6560
7227,2816,7228,7229,7230,7231,7232,7233,7234,4914,4500,4501,7235,7236,7237,2686, // 6576
7238,4915,7239,2897,4502,7240,4503,7241,2516,7242,4504,3362,3218,7243,7244,7245, // 6592
4916,7246,7247,4505,3363,7248,7249,7250,7251,3774,4506,7252,7253,4917,7254,7255, // 6608
3284,2991,4918,4919,3219,3892,4920,3106,3497,4921,7256,7257,7258,4922,7259,4923, // 6624
3364,4507,4508,4059,7260,4240,3498,7261,7262,4924,7263,2992,3893,4060,3220,7264, // 6640
7265,7266,7267,7268,7269,4509,3775,7270,2817,7271,4061,4925,4510,3776,7272,4241, // 6656
4511,3285,7273,7274,3499,7275,7276,7277,4062,4512,4926,7278,3107,3894,7279,7280, // 6672
4927,7281,4513,7282,7283,3668,7284,7285,4242,4514,4243,7286,2058,4515,4928,4929, // 6688
4516,7287,3286,4244,7288,4517,7289,7290,7291,3669,7292,7293,4930,4931,4932,2355, // 6704
4933,7294,2633,4518,7295,4245,7296,7297,4519,7298,7299,4520,4521,4934,7300,4246, // 6720
4522,7301,7302,7303,3579,7304,4247,4935,7305,4936,7306,7307,7308,7309,3777,7310, // 6736
4523,7311,7312,7313,4248,3580,7314,4524,3778,4249,7315,3581,7316,3287,7317,3221, // 6752
7318,4937,7319,7320,7321,7322,7323,7324,4938,4939,7325,4525,7326,7327,7328,4063, // 6768
7329,7330,4940,7331,7332,4941,7333,4526,7334,3500,2780,1741,4942,2026,1742,7335, // 6784
7336,3582,4527,2388,7337,7338,7339,4528,7340,4250,4943,7341,7342,7343,4944,7344, // 6800
7345,7346,3020,7347,4945,7348,7349,7350,7351,3895,7352,3896,4064,3897,7353,7354, // 6816
7355,4251,7356,7357,3898,7358,3779,7359,3780,3288,7360,7361,4529,7362,4946,4530, // 6832
2027,7363,3899,4531,4947,3222,3583,7364,4948,7365,7366,7367,7368,4949,3501,4950, // 6848
3781,4951,4532,7369,2517,4952,4252,4953,3155,7370,4954,4955,4253,2518,4533,7371, // 6864
7372,2712,4254,7373,7374,7375,3670,4956,3671,7376,2389,3502,4065,7377,2338,7378, // 6880
7379,7380,7381,3061,7382,4957,7383,7384,7385,7386,4958,4534,7387,7388,2993,7389, // 6896
3062,7390,4959,7391,7392,7393,4960,3108,4961,7394,4535,7395,4962,3421,4536,7396, // 6912
4963,7397,4964,1857,7398,4965,7399,7400,2176,3584,4966,7401,7402,3422,4537,3900, // 6928
3585,7403,3782,7404,2852,7405,7406,7407,4538,3783,2654,3423,4967,4539,7408,3784, // 6944
3586,2853,4540,4541,7409,3901,7410,3902,7411,7412,3785,3109,2327,3903,7413,7414, // 6960
2970,4066,2932,7415,7416,7417,3904,3672,3424,7418,4542,4543,4544,7419,4968,7420, // 6976
7421,4255,7422,7423,7424,7425,7426,4067,7427,3673,3365,4545,7428,3110,2559,3674, // 6992
7429,7430,3156,7431,7432,3503,7433,3425,4546,7434,3063,2873,7435,3223,4969,4547, // 7008
4548,2898,4256,4068,7436,4069,3587,3786,2933,3787,4257,4970,4971,3788,7437,4972, // 7024
3064,7438,4549,7439,7440,7441,7442,7443,4973,3905,7444,2874,7445,7446,7447,7448, // 7040
3021,7449,4550,3906,3588,4974,7450,7451,3789,3675,7452,2578,7453,4070,7454,7455, // 7056
7456,4258,3676,7457,4975,7458,4976,4259,3790,3504,2634,4977,3677,4551,4260,7459, // 7072
7460,7461,7462,3907,4261,4978,7463,7464,7465,7466,4979,4980,7467,7468,2213,4262, // 7088
7469,7470,7471,3678,4981,7472,2439,7473,4263,3224,3289,7474,3908,2415,4982,7475, // 7104
4264,7476,4983,2655,7477,7478,2732,4552,2854,2875,7479,7480,4265,7481,4553,4984, // 7120
7482,7483,4266,7484,3679,3366,3680,2818,2781,2782,3367,3589,4554,3065,7485,4071, // 7136
2899,7486,7487,3157,2462,4072,4555,4073,4985,4986,3111,4267,2687,3368,4556,4074, // 7152
3791,4268,7488,3909,2783,7489,2656,1962,3158,4557,4987,1963,3159,3160,7490,3112, // 7168
4988,4989,3022,4990,4991,3792,2855,7491,7492,2971,4558,7493,7494,4992,7495,7496, // 7184
7497,7498,4993,7499,3426,4559,4994,7500,3681,4560,4269,4270,3910,7501,4075,4995, // 7200
4271,7502,7503,4076,7504,4996,7505,3225,4997,4272,4077,2819,3023,7506,7507,2733, // 7216
4561,7508,4562,7509,3369,3793,7510,3590,2508,7511,7512,4273,3113,2994,2616,7513, // 7232
7514,7515,7516,7517,7518,2820,3911,4078,2748,7519,7520,4563,4998,7521,7522,7523, // 7248
7524,4999,4274,7525,4564,3682,2239,4079,4565,7526,7527,7528,7529,5000,7530,7531, // 7264
5001,4275,3794,7532,7533,7534,3066,5002,4566,3161,7535,7536,4080,7537,3162,7538, // 7280
7539,4567,7540,7541,7542,7543,7544,7545,5003,7546,4568,7547,7548,7549,7550,7551, // 7296
7552,7553,7554,7555,7556,5004,7557,7558,7559,5005,7560,3795,7561,4569,7562,7563, // 7312
7564,2821,3796,4276,4277,4081,7565,2876,7566,5006,7567,7568,2900,7569,3797,3912, // 7328
7570,7571,7572,4278,7573,7574,7575,5007,7576,7577,5008,7578,7579,4279,2934,7580, // 7344
7581,5009,7582,4570,7583,4280,7584,7585,7586,4571,4572,3913,7587,4573,3505,7588, // 7360
5010,7589,7590,7591,7592,3798,4574,7593,7594,5011,7595,4281,7596,7597,7598,4282, // 7376
5012,7599,7600,5013,3163,7601,5014,7602,3914,7603,7604,2734,4575,4576,4577,7605, // 7392
7606,7607,7608,7609,3506,5015,4578,7610,4082,7611,2822,2901,2579,3683,3024,4579, // 7408
3507,7612,4580,7613,3226,3799,5016,7614,7615,7616,7617,7618,7619,7620,2995,3290, // 7424
7621,4083,7622,5017,7623,7624,7625,7626,7627,4581,3915,7628,3291,7629,5018,7630, // 7440
7631,7632,7633,4084,7634,7635,3427,3800,7636,7637,4582,7638,5019,4583,5020,7639, // 7456
3916,7640,3801,5021,4584,4283,7641,7642,3428,3591,2269,7643,2617,7644,4585,3592, // 7472
7645,4586,2902,7646,7647,3227,5022,7648,4587,7649,4284,7650,7651,7652,4588,2284, // 7488
7653,5023,7654,7655,7656,4589,5024,3802,7657,7658,5025,3508,4590,7659,7660,7661, // 7504
1969,5026,7662,7663,3684,1821,2688,7664,2028,2509,4285,7665,2823,1841,7666,2689, // 7520
3114,7667,3917,4085,2160,5027,5028,2972,7668,5029,7669,7670,7671,3593,4086,7672, // 7536
4591,4087,5030,3803,7673,7674,7675,7676,7677,7678,7679,4286,2366,4592,4593,3067, // 7552
2328,7680,7681,4594,3594,3918,2029,4287,7682,5031,3919,3370,4288,4595,2856,7683, // 7568
3509,7684,7685,5032,5033,7686,7687,3804,2784,7688,7689,7690,7691,3371,7692,7693, // 7584
2877,5034,7694,7695,3920,4289,4088,7696,7697,7698,5035,7699,5036,4290,5037,5038, // 7600
5039,7700,7701,7702,5040,5041,3228,7703,1760,7704,5042,3229,4596,2106,4089,7705, // 7616
4597,2824,5043,2107,3372,7706,4291,4090,5044,7707,4091,7708,5045,3025,3805,4598, // 7632
4292,4293,4294,3373,7709,4599,7710,5046,7711,7712,5047,5048,3806,7713,7714,7715, // 7648
5049,7716,7717,7718,7719,4600,5050,7720,7721,7722,5051,7723,4295,3429,7724,7725, // 7664
7726,7727,3921,7728,3292,5052,4092,7729,7730,7731,7732,7733,7734,7735,5053,5054, // 7680
7736,7737,7738,7739,3922,3685,7740,7741,7742,7743,2635,5055,7744,5056,4601,7745, // 7696
7746,2560,7747,7748,7749,7750,3923,7751,7752,7753,7754,7755,4296,2903,7756,7757, // 7712
7758,7759,7760,3924,7761,5057,4297,7762,7763,5058,4298,7764,4093,7765,7766,5059, // 7728
3925,7767,7768,7769,7770,7771,7772,7773,7774,7775,7776,3595,7777,4299,5060,4094, // 7744
7778,3293,5061,7779,7780,4300,7781,7782,4602,7783,3596,7784,7785,3430,2367,7786, // 7760
3164,5062,5063,4301,7787,7788,4095,5064,5065,7789,3374,3115,7790,7791,7792,7793, // 7776
7794,7795,7796,3597,4603,7797,7798,3686,3116,3807,5066,7799,7800,5067,7801,7802, // 7792
4604,4302,5068,4303,4096,7803,7804,3294,7805,7806,5069,4605,2690,7807,3026,7808, // 7808
7809,7810,7811,7812,7813,7814,7815,7816,7817,7818,7819,7820,7821,7822,7823,7824, // 7824
7825,7826,7827,7828,7829,7830,7831,7832,7833,7834,7835,7836,7837,7838,7839,7840, // 7840
7841,7842,7843,7844,7845,7846,7847,7848,7849,7850,7851,7852,7853,7854,7855,7856, // 7856
7857,7858,7859,7860,7861,7862,7863,7864,7865,7866,7867,7868,7869,7870,7871,7872, // 7872
7873,7874,7875,7876,7877,7878,7879,7880,7881,7882,7883,7884,7885,7886,7887,7888, // 7888
7889,7890,7891,7892,7893,7894,7895,7896,7897,7898,7899,7900,7901,7902,7903,7904, // 7904
7905,7906,7907,7908,7909,7910,7911,7912,7913,7914,7915,7916,7917,7918,7919,7920, // 7920
7921,7922,7923,7924,3926,7925,7926,7927,7928,7929,7930,7931,7932,7933,7934,7935, // 7936
7936,7937,7938,7939,7940,7941,7942,7943,7944,7945,7946,7947,7948,7949,7950,7951, // 7952
7952,7953,7954,7955,7956,7957,7958,7959,7960,7961,7962,7963,7964,7965,7966,7967, // 7968
7968,7969,7970,7971,7972,7973,7974,7975,7976,7977,7978,7979,7980,7981,7982,7983, // 7984
7984,7985,7986,7987,7988,7989,7990,7991,7992,7993,7994,7995,7996,7997,7998,7999, // 8000
8000,8001,8002,8003,8004,8005,8006,8007,8008,8009,8010,8011,8012,8013,8014,8015, // 8016
8016,8017,8018,8019,8020,8021,8022,8023,8024,8025,8026,8027,8028,8029,8030,8031, // 8032
8032,8033,8034,8035,8036,8037,8038,8039,8040,8041,8042,8043,8044,8045,8046,8047, // 8048
8048,8049,8050,8051,8052,8053,8054,8055,8056,8057,8058,8059,8060,8061,8062,8063, // 8064
8064,8065,8066,8067,8068,8069,8070,8071,8072,8073,8074,8075,8076,8077,8078,8079, // 8080
8080,8081,8082,8083,8084,8085,8086,8087,8088,8089,8090,8091,8092,8093,8094,8095, // 8096
8096,8097,8098,8099,8100,8101,8102,8103,8104,8105,8106,8107,8108,8109,8110,8111, // 8112
8112,8113,8114,8115,8116,8117,8118,8119,8120,8121,8122,8123,8124,8125,8126,8127, // 8128
8128,8129,8130,8131,8132,8133,8134,8135,8136,8137,8138,8139,8140,8141,8142,8143, // 8144
8144,8145,8146,8147,8148,8149,8150,8151,8152,8153,8154,8155,8156,8157,8158,8159, // 8160
8160,8161,8162,8163,8164,8165,8166,8167,8168,8169,8170,8171,8172,8173,8174,8175, // 8176
8176,8177,8178,8179,8180,8181,8182,8183,8184,8185,8186,8187,8188,8189,8190,8191, // 8192
8192,8193,8194,8195,8196,8197,8198,8199,8200,8201,8202,8203,8204,8205,8206,8207, // 8208
8208,8209,8210,8211,8212,8213,8214,8215,8216,8217,8218,8219,8220,8221,8222,8223, // 8224
8224,8225,8226,8227,8228,8229,8230,8231,8232,8233,8234,8235,8236,8237,8238,8239, // 8240
8240,8241,8242,8243,8244,8245,8246,8247,8248,8249,8250,8251,8252,8253,8254,8255, // 8256
8256,8257,8258,8259,8260,8261,8262,8263,8264,8265,8266,8267,8268,8269,8270,8271 // 8272
];

/*
 * The Original Code is Mozilla Universal charset detector code.
 *
 * The Initial Developer of the Original Code is
 * Netscape Communications Corporation.
 * Portions created by the Initial Developer are Copyright (C) 2001
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   António Afonso (antonio.afonso gmail.com) - port to JavaScript
 *   Mark Pilgrim - port to Python
 *   Shy Shalom - original C code
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301  USA
 */

// GB2312 most frequently used character table
//
// Char to FreqOrder table , from hz6763

// 512  --> 0.79  -- 0.79
// 1024 --> 0.92  -- 0.13
// 2048 --> 0.98  -- 0.06
// 6768 --> 1.00  -- 0.02
//
// Ideal Distribution Ratio = 0.79135/(1-0.79135) = 3.79
// Random Distribution Ration = 512 / (3755 - 512) = 0.157
//
// Typical Distribution Ratio about 25% of Ideal one, still much higher that RDR

jschardet.GB2312_TYPICAL_DISTRIBUTION_RATIO = 0.9;

jschardet.GB2312_TABLE_SIZE = 3760;

jschardet.GB2312CharToFreqOrder = [
1671, 749,1443,2364,3924,3807,2330,3921,1704,3463,2691,1511,1515, 572,3191,2205,
2361, 224,2558, 479,1711, 963,3162, 440,4060,1905,2966,2947,3580,2647,3961,3842,
2204, 869,4207, 970,2678,5626,2944,2956,1479,4048, 514,3595, 588,1346,2820,3409,
 249,4088,1746,1873,2047,1774, 581,1813, 358,1174,3590,1014,1561,4844,2245, 670,
1636,3112, 889,1286, 953, 556,2327,3060,1290,3141, 613, 185,3477,1367, 850,3820,
1715,2428,2642,2303,2732,3041,2562,2648,3566,3946,1349, 388,3098,2091,1360,3585,
 152,1687,1539, 738,1559,  59,1232,2925,2267,1388,1249,1741,1679,2960, 151,1566,
1125,1352,4271, 924,4296, 385,3166,4459, 310,1245,2850,  70,3285,2729,3534,3575,
2398,3298,3466,1960,2265, 217,3647, 864,1909,2084,4401,2773,1010,3269,5152, 853,
3051,3121,1244,4251,1895, 364,1499,1540,2313,1180,3655,2268, 562, 715,2417,3061,
 544, 336,3768,2380,1752,4075, 950, 280,2425,4382, 183,2759,3272, 333,4297,2155,
1688,2356,1444,1039,4540, 736,1177,3349,2443,2368,2144,2225, 565, 196,1482,3406,
 927,1335,4147, 692, 878,1311,1653,3911,3622,1378,4200,1840,2969,3149,2126,1816,
2534,1546,2393,2760, 737,2494,  13, 447, 245,2747,  38,2765,2129,2589,1079, 606,
 360, 471,3755,2890, 404, 848, 699,1785,1236, 370,2221,1023,3746,2074,2026,2023,
2388,1581,2119, 812,1141,3091,2536,1519, 804,2053, 406,1596,1090, 784, 548,4414,
1806,2264,2936,1100, 343,4114,5096, 622,3358, 743,3668,1510,1626,5020,3567,2513,
3195,4115,5627,2489,2991,  24,2065,2697,1087,2719,  48,1634, 315,  68, 985,2052,
 198,2239,1347,1107,1439, 597,2366,2172, 871,3307, 919,2487,2790,1867, 236,2570,
1413,3794, 906,3365,3381,1701,1982,1818,1524,2924,1205, 616,2586,2072,2004, 575,
 253,3099,  32,1365,1182, 197,1714,2454,1201, 554,3388,3224,2748, 756,2587, 250,
2567,1507,1517,3529,1922,2761,2337,3416,1961,1677,2452,2238,3153, 615, 911,1506,
1474,2495,1265,1906,2749,3756,3280,2161, 898,2714,1759,3450,2243,2444, 563,  26,
3286,2266,3769,3344,2707,3677, 611,1402, 531,1028,2871,4548,1375, 261,2948, 835,
1190,4134, 353, 840,2684,1900,3082,1435,2109,1207,1674, 329,1872,2781,4055,2686,
2104, 608,3318,2423,2957,2768,1108,3739,3512,3271,3985,2203,1771,3520,1418,2054,
1681,1153, 225,1627,2929, 162,2050,2511,3687,1954, 124,1859,2431,1684,3032,2894,
 585,4805,3969,2869,2704,2088,2032,2095,3656,2635,4362,2209, 256, 518,2042,2105,
3777,3657, 643,2298,1148,1779, 190, 989,3544, 414,  11,2135,2063,2979,1471, 403,
3678, 126, 770,1563, 671,2499,3216,2877, 600,1179, 307,2805,4937,1268,1297,2694,
 252,4032,1448,1494,1331,1394, 127,2256, 222,1647,1035,1481,3056,1915,1048, 873,
3651, 210,  33,1608,2516, 200,1520, 415, 102,   0,3389,1287, 817,  91,3299,2940,
 836,1814, 549,2197,1396,1669,2987,3582,2297,2848,4528,1070, 687,  20,1819, 121,
1552,1364,1461,1968,2617,3540,2824,2083, 177, 948,4938,2291, 110,4549,2066, 648,
3359,1755,2110,2114,4642,4845,1693,3937,3308,1257,1869,2123, 208,1804,3159,2992,
2531,2549,3361,2418,1350,2347,2800,2568,1291,2036,2680,  72, 842,1990, 212,1233,
1154,1586,  75,2027,3410,4900,1823,1337,2710,2676, 728,2810,1522,3026,4995, 157,
 755,1050,4022, 710, 785,1936,2194,2085,1406,2777,2400, 150,1250,4049,1206, 807,
1910, 534, 529,3309,1721,1660, 274,  39,2827, 661,2670,1578, 925,3248,3815,1094,
4278,4901,4252,  41,1150,3747,2572,2227,4501,3658,4902,3813,3357,3617,2884,2258,
 887, 538,4187,3199,1294,2439,3042,2329,2343,2497,1255, 107, 543,1527, 521,3478,
3568, 194,5062,  15, 961,3870,1241,1192,2664,  66,5215,3260,2111,1295,1127,2152,
3805,4135, 901,1164,1976, 398,1278, 530,1460, 748, 904,1054,1966,1426,  53,2909,
 509, 523,2279,1534, 536,1019, 239,1685, 460,2353, 673,1065,2401,3600,4298,2272,
1272,2363, 284,1753,3679,4064,1695,  81, 815,2677,2757,2731,1386, 859, 500,4221,
2190,2566, 757,1006,2519,2068,1166,1455, 337,2654,3203,1863,1682,1914,3025,1252,
1409,1366, 847, 714,2834,2038,3209, 964,2970,1901, 885,2553,1078,1756,3049, 301,
1572,3326, 688,2130,1996,2429,1805,1648,2930,3421,2750,3652,3088, 262,1158,1254,
 389,1641,1812, 526,1719, 923,2073,1073,1902, 468, 489,4625,1140, 857,2375,3070,
3319,2863, 380, 116,1328,2693,1161,2244, 273,1212,1884,2769,3011,1775,1142, 461,
3066,1200,2147,2212, 790, 702,2695,4222,1601,1058, 434,2338,5153,3640,  67,2360,
4099,2502, 618,3472,1329, 416,1132, 830,2782,1807,2653,3211,3510,1662, 192,2124,
 296,3979,1739,1611,3684,  23, 118, 324, 446,1239,1225, 293,2520,3814,3795,2535,
3116,  17,1074, 467,2692,2201, 387,2922,  45,1326,3055,1645,3659,2817, 958, 243,
1903,2320,1339,2825,1784,3289, 356, 576, 865,2315,2381,3377,3916,1088,3122,1713,
1655, 935, 628,4689,1034,1327, 441, 800, 720, 894,1979,2183,1528,5289,2702,1071,
4046,3572,2399,1571,3281,  79, 761,1103, 327, 134, 758,1899,1371,1615, 879, 442,
 215,2605,2579, 173,2048,2485,1057,2975,3317,1097,2253,3801,4263,1403,1650,2946,
 814,4968,3487,1548,2644,1567,1285,   2, 295,2636,  97, 946,3576, 832, 141,4257,
3273, 760,3821,3521,3156,2607, 949,1024,1733,1516,1803,1920,2125,2283,2665,3180,
1501,2064,3560,2171,1592, 803,3518,1416, 732,3897,4258,1363,1362,2458, 119,1427,
 602,1525,2608,1605,1639,3175, 694,3064,  10, 465,  76,2000,4846,4208, 444,3781,
1619,3353,2206,1273,3796, 740,2483, 320,1723,2377,3660,2619,1359,1137,1762,1724,
2345,2842,1850,1862, 912, 821,1866, 612,2625,1735,2573,3369,1093, 844,  89, 937,
 930,1424,3564,2413,2972,1004,3046,3019,2011, 711,3171,1452,4178, 428, 801,1943,
 432, 445,2811, 206,4136,1472, 730, 349,  73, 397,2802,2547, 998,1637,1167, 789,
 396,3217, 154,1218, 716,1120,1780,2819,4826,1931,3334,3762,2139,1215,2627, 552,
3664,3628,3232,1405,2383,3111,1356,2652,3577,3320,3101,1703, 640,1045,1370,1246,
4996, 371,1575,2436,1621,2210, 984,4033,1734,2638,  16,4529, 663,2755,3255,1451,
3917,2257,1253,1955,2234,1263,2951, 214,1229, 617, 485, 359,1831,1969, 473,2310,
 750,2058, 165,  80,2864,2419, 361,4344,2416,2479,1134, 796,3726,1266,2943, 860,
2715, 938, 390,2734,1313,1384, 248, 202, 877,1064,2854, 522,3907, 279,1602, 297,
2357, 395,3740, 137,2075, 944,4089,2584,1267,3802,  62,1533,2285, 178, 176, 780,
2440, 201,3707, 590, 478,1560,4354,2117,1075,  30,  74,4643,4004,1635,1441,2745,
 776,2596, 238,1077,1692,1912,2844, 605, 499,1742,3947, 241,3053, 980,1749, 936,
2640,4511,2582, 515,1543,2162,5322,2892,2993, 890,2148,1924, 665,1827,3581,1032,
 968,3163, 339,1044,1896, 270, 583,1791,1720,4367,1194,3488,3669,  43,2523,1657,
 163,2167, 290,1209,1622,3378, 550, 634,2508,2510, 695,2634,2384,2512,1476,1414,
 220,1469,2341,2138,2852,3183,2900,4939,2865,3502,1211,3680, 854,3227,1299,2976,
3172, 186,2998,1459, 443,1067,3251,1495, 321,1932,3054, 909, 753,1410,1828, 436,
2441,1119,1587,3164,2186,1258, 227, 231,1425,1890,3200,3942, 247, 959, 725,5254,
2741, 577,2158,2079, 929, 120, 174, 838,2813, 591,1115, 417,2024,  40,3240,1536,
1037, 291,4151,2354, 632,1298,2406,2500,3535,1825,1846,3451, 205,1171, 345,4238,
  18,1163, 811, 685,2208,1217, 425,1312,1508,1175,4308,2552,1033, 587,1381,3059,
2984,3482, 340,1316,4023,3972, 792,3176, 519, 777,4690, 918, 933,4130,2981,3741,
  90,3360,2911,2200,5184,4550, 609,3079,2030, 272,3379,2736, 363,3881,1130,1447,
 286, 779, 357,1169,3350,3137,1630,1220,2687,2391, 747,1277,3688,2618,2682,2601,
1156,3196,5290,4034,3102,1689,3596,3128, 874, 219,2783, 798, 508,1843,2461, 269,
1658,1776,1392,1913,2983,3287,2866,2159,2372, 829,4076,  46,4253,2873,1889,1894,
 915,1834,1631,2181,2318, 298, 664,2818,3555,2735, 954,3228,3117, 527,3511,2173,
 681,2712,3033,2247,2346,3467,1652, 155,2164,3382, 113,1994, 450, 899, 494, 994,
1237,2958,1875,2336,1926,3727, 545,1577,1550, 633,3473, 204,1305,3072,2410,1956,
2471, 707,2134, 841,2195,2196,2663,3843,1026,4940, 990,3252,4997, 368,1092, 437,
3212,3258,1933,1829, 675,2977,2893, 412, 943,3723,4644,3294,3283,2230,2373,5154,
2389,2241,2661,2323,1404,2524, 593, 787, 677,3008,1275,2059, 438,2709,2609,2240,
2269,2246,1446,  36,1568,1373,3892,1574,2301,1456,3962, 693,2276,5216,2035,1143,
2720,1919,1797,1811,2763,4137,2597,1830,1699,1488,1198,2090, 424,1694, 312,3634,
3390,4179,3335,2252,1214, 561,1059,3243,2295,2561, 975,5155,2321,2751,3772, 472,
1537,3282,3398,1047,2077,2348,2878,1323,3340,3076, 690,2906,  51, 369, 170,3541,
1060,2187,2688,3670,2541,1083,1683, 928,3918, 459, 109,4427, 599,3744,4286, 143,
2101,2730,2490,  82,1588,3036,2121, 281,1860, 477,4035,1238,2812,3020,2716,3312,
1530,2188,2055,1317, 843, 636,1808,1173,3495, 649, 181,1002, 147,3641,1159,2414,
3750,2289,2795, 813,3123,2610,1136,4368,   5,3391,4541,2174, 420, 429,1728, 754,
1228,2115,2219, 347,2223,2733, 735,1518,3003,2355,3134,1764,3948,3329,1888,2424,
1001,1234,1972,3321,3363,1672,1021,1450,1584, 226, 765, 655,2526,3404,3244,2302,
3665, 731, 594,2184, 319,1576, 621, 658,2656,4299,2099,3864,1279,2071,2598,2739,
 795,3086,3699,3908,1707,2352,2402,1382,3136,2475,1465,4847,3496,3865,1085,3004,
2591,1084, 213,2287,1963,3565,2250, 822, 793,4574,3187,1772,1789,3050, 595,1484,
1959,2770,1080,2650, 456, 422,2996, 940,3322,4328,4345,3092,2742, 965,2784, 739,
4124, 952,1358,2498,2949,2565, 332,2698,2378, 660,2260,2473,4194,3856,2919, 535,
1260,2651,1208,1428,1300,1949,1303,2942, 433,2455,2450,1251,1946, 614,1269, 641,
1306,1810,2737,3078,2912, 564,2365,1419,1415,1497,4460,2367,2185,1379,3005,1307,
3218,2175,1897,3063, 682,1157,4040,4005,1712,1160,1941,1399, 394, 402,2952,1573,
1151,2986,2404, 862, 299,2033,1489,3006, 346, 171,2886,3401,1726,2932, 168,2533,
  47,2507,1030,3735,1145,3370,1395,1318,1579,3609,4560,2857,4116,1457,2529,1965,
 504,1036,2690,2988,2405, 745,5871, 849,2397,2056,3081, 863,2359,3857,2096,  99,
1397,1769,2300,4428,1643,3455,1978,1757,3718,1440,  35,4879,3742,1296,4228,2280,
 160,5063,1599,2013, 166, 520,3479,1646,3345,3012, 490,1937,1545,1264,2182,2505,
1096,1188,1369,1436,2421,1667,2792,2460,1270,2122, 727,3167,2143, 806,1706,1012,
1800,3037, 960,2218,1882, 805, 139,2456,1139,1521, 851,1052,3093,3089, 342,2039,
 744,5097,1468,1502,1585,2087, 223, 939, 326,2140,2577, 892,2481,1623,4077, 982,
3708, 135,2131,  87,2503,3114,2326,1106, 876,1616, 547,2997,2831,2093,3441,4530,
4314,   9,3256,4229,4148, 659,1462,1986,1710,2046,2913,2231,4090,4880,5255,3392,
3274,1368,3689,4645,1477, 705,3384,3635,1068,1529,2941,1458,3782,1509, 100,1656,
2548, 718,2339, 408,1590,2780,3548,1838,4117,3719,1345,3530, 717,3442,2778,3220,
2898,1892,4590,3614,3371,2043,1998,1224,3483, 891, 635, 584,2559,3355, 733,1766,
1729,1172,3789,1891,2307, 781,2982,2271,1957,1580,5773,2633,2005,4195,3097,1535,
3213,1189,1934,5693,3262, 586,3118,1324,1598, 517,1564,2217,1868,1893,4445,3728,
2703,3139,1526,1787,1992,3882,2875,1549,1199,1056,2224,1904,2711,5098,4287, 338,
1993,3129,3489,2689,1809,2815,1997, 957,1855,3898,2550,3275,3057,1105,1319, 627,
1505,1911,1883,3526, 698,3629,3456,1833,1431, 746,  77,1261,2017,2296,1977,1885,
 125,1334,1600, 525,1798,1109,2222,1470,1945, 559,2236,1186,3443,2476,1929,1411,
2411,3135,1777,3372,2621,1841,1613,3229, 668,1430,1839,2643,2916, 195,1989,2671,
2358,1387, 629,3205,2293,5256,4439, 123,1310, 888,1879,4300,3021,3605,1003,1162,
3192,2910,2010, 140,2395,2859,  55,1082,2012,2901, 662, 419,2081,1438, 680,2774,
4654,3912,1620,1731,1625,5035,4065,2328, 512,1344, 802,5443,2163,2311,2537, 524,
3399,  98,1155,2103,1918,2606,3925,2816,1393,2465,1504,3773,2177,3963,1478,4346,
 180,1113,4655,3461,2028,1698, 833,2696,1235,1322,1594,4408,3623,3013,3225,2040,
3022, 541,2881, 607,3632,2029,1665,1219, 639,1385,1686,1099,2803,3231,1938,3188,
2858, 427, 676,2772,1168,2025, 454,3253,2486,3556, 230,1950, 580, 791,1991,1280,
1086,1974,2034, 630, 257,3338,2788,4903,1017,  86,4790, 966,2789,1995,1696,1131,
 259,3095,4188,1308, 179,1463,5257, 289,4107,1248,  42,3413,1725,2288, 896,1947,
 774,4474,4254, 604,3430,4264, 392,2514,2588, 452, 237,1408,3018, 988,4531,1970,
3034,3310, 540,2370,1562,1288,2990, 502,4765,1147,   4,1853,2708, 207, 294,2814,
4078,2902,2509, 684,  34,3105,3532,2551, 644, 709,2801,2344, 573,1727,3573,3557,
2021,1081,3100,4315,2100,3681, 199,2263,1837,2385, 146,3484,1195,2776,3949, 997,
1939,3973,1008,1091,1202,1962,1847,1149,4209,5444,1076, 493, 117,5400,2521, 972,
1490,2934,1796,4542,2374,1512,2933,2657, 413,2888,1135,2762,2314,2156,1355,2369,
 766,2007,2527,2170,3124,2491,2593,2632,4757,2437, 234,3125,3591,1898,1750,1376,
1942,3468,3138, 570,2127,2145,3276,4131, 962, 132,1445,4196,  19, 941,3624,3480,
3366,1973,1374,4461,3431,2629, 283,2415,2275, 808,2887,3620,2112,2563,1353,3610,
 955,1089,3103,1053,  96,  88,4097, 823,3808,1583, 399, 292,4091,3313, 421,1128,
 642,4006, 903,2539,1877,2082, 596,  29,4066,1790, 722,2157, 130, 995,1569, 769,
1485, 464, 513,2213, 288,1923,1101,2453,4316, 133, 486,2445,  50, 625, 487,2207,
  57, 423, 481,2962, 159,3729,1558, 491, 303, 482, 501, 240,2837, 112,3648,2392,
1783, 362,   8,3433,3422, 610,2793,3277,1390,1284,1654,  21,3823, 734, 367, 623,
 193, 287, 374,1009,1483, 816, 476, 313,2255,2340,1262,2150,2899,1146,2581, 782,
2116,1659,2018,1880, 255,3586,3314,1110,2867,2137,2564, 986,2767,5185,2006, 650,
 158, 926, 762, 881,3157,2717,2362,3587, 306,3690,3245,1542,3077,2427,1691,2478,
2118,2985,3490,2438, 539,2305, 983, 129,1754, 355,4201,2386, 827,2923, 104,1773,
2838,2771, 411,2905,3919, 376, 767, 122,1114, 828,2422,1817,3506, 266,3460,1007,
1609,4998, 945,2612,4429,2274, 726,1247,1964,2914,2199,2070,4002,4108, 657,3323,
1422, 579, 455,2764,4737,1222,2895,1670, 824,1223,1487,2525, 558, 861,3080, 598,
2659,2515,1967, 752,2583,2376,2214,4180, 977, 704,2464,4999,2622,4109,1210,2961,
 819,1541, 142,2284,  44, 418, 457,1126,3730,4347,4626,1644,1876,3671,1864, 302,
1063,5694, 624, 723,1984,3745,1314,1676,2488,1610,1449,3558,3569,2166,2098, 409,
1011,2325,3704,2306, 818,1732,1383,1824,1844,3757, 999,2705,3497,1216,1423,2683,
2426,2954,2501,2726,2229,1475,2554,5064,1971,1794,1666,2014,1343, 783, 724, 191,
2434,1354,2220,5065,1763,2752,2472,4152, 131, 175,2885,3434,  92,1466,4920,2616,
3871,3872,3866, 128,1551,1632, 669,1854,3682,4691,4125,1230, 188,2973,3290,1302,
1213, 560,3266, 917, 763,3909,3249,1760, 868,1958, 764,1782,2097, 145,2277,3774,
4462,  64,1491,3062, 971,2132,3606,2442, 221,1226,1617, 218, 323,1185,3207,3147,
 571, 619,1473,1005,1744,2281, 449,1887,2396,3685, 275, 375,3816,1743,3844,3731,
 845,1983,2350,4210,1377, 773, 967,3499,3052,3743,2725,4007,1697,1022,3943,1464,
3264,2855,2722,1952,1029,2839,2467,  84,4383,2215, 820,1391,2015,2448,3672, 377,
1948,2168, 797,2545,3536,2578,2645,  94,2874,1678, 405,1259,3071, 771, 546,1315,
 470,1243,3083, 895,2468, 981, 969,2037, 846,4181, 653,1276,2928,  14,2594, 557,
3007,2474, 156, 902,1338,1740,2574, 537,2518, 973,2282,2216,2433,1928, 138,2903,
1293,2631,1612, 646,3457, 839,2935, 111, 496,2191,2847, 589,3186, 149,3994,2060,
4031,2641,4067,3145,1870,  37,3597,2136,1025,2051,3009,3383,3549,1121,1016,3261,
1301, 251,2446,2599,2153, 872,3246, 637, 334,3705, 831, 884, 921,3065,3140,4092,
2198,1944, 246,2964, 108,2045,1152,1921,2308,1031, 203,3173,4170,1907,3890, 810,
1401,2003,1690, 506, 647,1242,2828,1761,1649,3208,2249,1589,3709,2931,5156,1708,
 498, 666,2613, 834,3817,1231, 184,2851,1124, 883,3197,2261,3710,1765,1553,2658,
1178,2639,2351,  93,1193, 942,2538,2141,4402, 235,1821, 870,1591,2192,1709,1871,
3341,1618,4126,2595,2334, 603, 651,  69, 701, 268,2662,3411,2555,1380,1606, 503,
 448, 254,2371,2646, 574,1187,2309,1770, 322,2235,1292,1801, 305, 566,1133, 229,
2067,2057, 706, 167, 483,2002,2672,3295,1820,3561,3067, 316, 378,2746,3452,1112,
 136,1981, 507,1651,2917,1117, 285,4591, 182,2580,3522,1304, 335,3303,1835,2504,
1795,1792,2248, 674,1018,2106,2449,1857,2292,2845, 976,3047,1781,2600,2727,1389,
1281,  52,3152, 153, 265,3950, 672,3485,3951,4463, 430,1183, 365, 278,2169,  27,
1407,1336,2304, 209,1340,1730,2202,1852,2403,2883, 979,1737,1062, 631,2829,2542,
3876,2592, 825,2086,2226,3048,3625, 352,1417,3724, 542, 991, 431,1351,3938,1861,
2294, 826,1361,2927,3142,3503,1738, 463,2462,2723, 582,1916,1595,2808, 400,3845,
3891,2868,3621,2254,  58,2492,1123, 910,2160,2614,1372,1603,1196,1072,3385,1700,
3267,1980, 696, 480,2430, 920, 799,1570,2920,1951,2041,4047,2540,1321,4223,2469,
3562,2228,1271,2602, 401,2833,3351,2575,5157, 907,2312,1256, 410, 263,3507,1582,
 996, 678,1849,2316,1480, 908,3545,2237, 703,2322, 667,1826,2849,1531,2604,2999,
2407,3146,2151,2630,1786,3711, 469,3542, 497,3899,2409, 858, 837,4446,3393,1274,
 786, 620,1845,2001,3311, 484, 308,3367,1204,1815,3691,2332,1532,2557,1842,2020,
2724,1927,2333,4440, 567,  22,1673,2728,4475,1987,1858,1144,1597, 101,1832,3601,
  12, 974,3783,4391, 951,1412,   1,3720, 453,4608,4041, 528,1041,1027,3230,2628,
1129, 875,1051,3291,1203,2262,1069,2860,2799,2149,2615,3278, 144,1758,3040,  31,
 475,1680, 366,2685,3184, 311,1642,4008,2466,5036,1593,1493,2809, 216,1420,1668,
 233, 304,2128,3284, 232,1429,1768,1040,2008,3407,2740,2967,2543, 242,2133, 778,
1565,2022,2620, 505,2189,2756,1098,2273, 372,1614, 708, 553,2846,2094,2278, 169,
3626,2835,4161, 228,2674,3165, 809,1454,1309, 466,1705,1095, 900,3423, 880,2667,
3751,5258,2317,3109,2571,4317,2766,1503,1342, 866,4447,1118,  63,2076, 314,1881,
1348,1061, 172, 978,3515,1747, 532, 511,3970,   6, 601, 905,2699,3300,1751, 276,
1467,3725,2668,  65,4239,2544,2779,2556,1604, 578,2451,1802, 992,2331,2624,1320,
3446, 713,1513,1013, 103,2786,2447,1661, 886,1702, 916, 654,3574,2031,1556, 751,
2178,2821,2179,1498,1538,2176, 271, 914,2251,2080,1325, 638,1953,2937,3877,2432,
2754,  95,3265,1716, 260,1227,4083, 775, 106,1357,3254, 426,1607, 555,2480, 772,
1985, 244,2546, 474, 495,1046,2611,1851,2061,  71,2089,1675,2590, 742,3758,2843,
3222,1433, 267,2180,2576,2826,2233,2092,3913,2435, 956,1745,3075, 856,2113,1116,
 451,   3,1988,2896,1398, 993,2463,1878,2049,1341,2718,2721,2870,2108, 712,2904,
4363,2753,2324, 277,2872,2349,2649, 384, 987, 435, 691,3000, 922, 164,3939, 652,
1500,1184,4153,2482,3373,2165,4848,2335,3775,3508,3154,2806,2830,1554,2102,1664,
2530,1434,2408, 893,1547,2623,3447,2832,2242,2532,3169,2856,3223,2078,  49,3770,
3469, 462, 318, 656,2259,3250,3069, 679,1629,2758, 344,1138,1104,3120,1836,1283,
3115,2154,1437,4448, 934, 759,1999, 794,2862,1038, 533,2560,1722,2342, 855,2626,
1197,1663,4476,3127,  85,4240,2528,  25,1111,1181,3673, 407,3470,4561,2679,2713,
 768,1925,2841,3986,1544,1165, 932, 373,1240,2146,1930,2673, 721,4766, 354,4333,
 391,2963, 187,  61,3364,1442,1102, 330,1940,1767, 341,3809,4118, 393,2496,2062,
2211, 105, 331, 300, 439, 913,1332, 626, 379,3304,1557, 328, 689,3952, 309,1555,
 931, 317,2517,3027, 325, 569, 686,2107,3084,  60,1042,1333,2794, 264,3177,4014,
1628, 258,3712,   7,4464,1176,1043,1778, 683, 114,1975,  78,1492, 383,1886, 510,
 386, 645,5291,2891,2069,3305,4138,3867,2939,2603,2493,1935,1066,1848,3588,1015,
1282,1289,4609, 697,1453,3044,2666,3611,1856,2412,  54, 719,1330, 568,3778,2459,
1748, 788, 492, 551,1191,1000, 488,3394,3763, 282,1799, 348,2016,1523,3155,2390,
1049, 382,2019,1788,1170, 729,2968,3523, 897,3926,2785,2938,3292, 350,2319,3238,
1718,1717,2655,3453,3143,4465, 161,2889,2980,2009,1421,  56,1908,1640,2387,2232,
1917,1874,2477,4921, 148,  83,3438, 592,4245,2882,1822,1055, 741, 115,1496,1624,
 381,1638,4592,1020, 516,3214, 458, 947,4575,1432, 211,1514,2926,1865,2142, 189,
 852,1221,1400,1486, 882,2299,4036, 351,  28,1122, 700,6479,6480,6481,6482,6483,  // last 512
//Everything below is of no interest for detection purpose
5508,6484,3900,3414,3974,4441,4024,3537,4037,5628,5099,3633,6485,3148,6486,3636,
5509,3257,5510,5973,5445,5872,4941,4403,3174,4627,5873,6276,2286,4230,5446,5874,
5122,6102,6103,4162,5447,5123,5323,4849,6277,3980,3851,5066,4246,5774,5067,6278,
3001,2807,5695,3346,5775,5974,5158,5448,6487,5975,5976,5776,3598,6279,5696,4806,
4211,4154,6280,6488,6489,6490,6281,4212,5037,3374,4171,6491,4562,4807,4722,4827,
5977,6104,4532,4079,5159,5324,5160,4404,3858,5359,5875,3975,4288,4610,3486,4512,
5325,3893,5360,6282,6283,5560,2522,4231,5978,5186,5449,2569,3878,6284,5401,3578,
4415,6285,4656,5124,5979,2506,4247,4449,3219,3417,4334,4969,4329,6492,4576,4828,
4172,4416,4829,5402,6286,3927,3852,5361,4369,4830,4477,4867,5876,4173,6493,6105,
4657,6287,6106,5877,5450,6494,4155,4868,5451,3700,5629,4384,6288,6289,5878,3189,
4881,6107,6290,6495,4513,6496,4692,4515,4723,5100,3356,6497,6291,3810,4080,5561,
3570,4430,5980,6498,4355,5697,6499,4724,6108,6109,3764,4050,5038,5879,4093,3226,
6292,5068,5217,4693,3342,5630,3504,4831,4377,4466,4309,5698,4431,5777,6293,5778,
4272,3706,6110,5326,3752,4676,5327,4273,5403,4767,5631,6500,5699,5880,3475,5039,
6294,5562,5125,4348,4301,4482,4068,5126,4593,5700,3380,3462,5981,5563,3824,5404,
4970,5511,3825,4738,6295,6501,5452,4516,6111,5881,5564,6502,6296,5982,6503,4213,
4163,3454,6504,6112,4009,4450,6113,4658,6297,6114,3035,6505,6115,3995,4904,4739,
4563,4942,4110,5040,3661,3928,5362,3674,6506,5292,3612,4791,5565,4149,5983,5328,
5259,5021,4725,4577,4564,4517,4364,6298,5405,4578,5260,4594,4156,4157,5453,3592,
3491,6507,5127,5512,4709,4922,5984,5701,4726,4289,6508,4015,6116,5128,4628,3424,
4241,5779,6299,4905,6509,6510,5454,5702,5780,6300,4365,4923,3971,6511,5161,3270,
3158,5985,4100, 867,5129,5703,6117,5363,3695,3301,5513,4467,6118,6512,5455,4232,
4242,4629,6513,3959,4478,6514,5514,5329,5986,4850,5162,5566,3846,4694,6119,5456,
4869,5781,3779,6301,5704,5987,5515,4710,6302,5882,6120,4392,5364,5705,6515,6121,
6516,6517,3736,5988,5457,5989,4695,2457,5883,4551,5782,6303,6304,6305,5130,4971,
6122,5163,6123,4870,3263,5365,3150,4871,6518,6306,5783,5069,5706,3513,3498,4409,
5330,5632,5366,5458,5459,3991,5990,4502,3324,5991,5784,3696,4518,5633,4119,6519,
4630,5634,4417,5707,4832,5992,3418,6124,5993,5567,4768,5218,6520,4595,3458,5367,
6125,5635,6126,4202,6521,4740,4924,6307,3981,4069,4385,6308,3883,2675,4051,3834,
4302,4483,5568,5994,4972,4101,5368,6309,5164,5884,3922,6127,6522,6523,5261,5460,
5187,4164,5219,3538,5516,4111,3524,5995,6310,6311,5369,3181,3386,2484,5188,3464,
5569,3627,5708,6524,5406,5165,4677,4492,6312,4872,4851,5885,4468,5996,6313,5709,
5710,6128,2470,5886,6314,5293,4882,5785,3325,5461,5101,6129,5711,5786,6525,4906,
6526,6527,4418,5887,5712,4808,2907,3701,5713,5888,6528,3765,5636,5331,6529,6530,
3593,5889,3637,4943,3692,5714,5787,4925,6315,6130,5462,4405,6131,6132,6316,5262,
6531,6532,5715,3859,5716,5070,4696,5102,3929,5788,3987,4792,5997,6533,6534,3920,
4809,5000,5998,6535,2974,5370,6317,5189,5263,5717,3826,6536,3953,5001,4883,3190,
5463,5890,4973,5999,4741,6133,6134,3607,5570,6000,4711,3362,3630,4552,5041,6318,
6001,2950,2953,5637,4646,5371,4944,6002,2044,4120,3429,6319,6537,5103,4833,6538,
6539,4884,4647,3884,6003,6004,4758,3835,5220,5789,4565,5407,6540,6135,5294,4697,
4852,6320,6321,3206,4907,6541,6322,4945,6542,6136,6543,6323,6005,4631,3519,6544,
5891,6545,5464,3784,5221,6546,5571,4659,6547,6324,6137,5190,6548,3853,6549,4016,
4834,3954,6138,5332,3827,4017,3210,3546,4469,5408,5718,3505,4648,5790,5131,5638,
5791,5465,4727,4318,6325,6326,5792,4553,4010,4698,3439,4974,3638,4335,3085,6006,
5104,5042,5166,5892,5572,6327,4356,4519,5222,5573,5333,5793,5043,6550,5639,5071,
4503,6328,6139,6551,6140,3914,3901,5372,6007,5640,4728,4793,3976,3836,4885,6552,
4127,6553,4451,4102,5002,6554,3686,5105,6555,5191,5072,5295,4611,5794,5296,6556,
5893,5264,5894,4975,5466,5265,4699,4976,4370,4056,3492,5044,4886,6557,5795,4432,
4769,4357,5467,3940,4660,4290,6141,4484,4770,4661,3992,6329,4025,4662,5022,4632,
4835,4070,5297,4663,4596,5574,5132,5409,5895,6142,4504,5192,4664,5796,5896,3885,
5575,5797,5023,4810,5798,3732,5223,4712,5298,4084,5334,5468,6143,4052,4053,4336,
4977,4794,6558,5335,4908,5576,5224,4233,5024,4128,5469,5225,4873,6008,5045,4729,
4742,4633,3675,4597,6559,5897,5133,5577,5003,5641,5719,6330,6560,3017,2382,3854,
4406,4811,6331,4393,3964,4946,6561,2420,3722,6562,4926,4378,3247,1736,4442,6332,
5134,6333,5226,3996,2918,5470,4319,4003,4598,4743,4744,4485,3785,3902,5167,5004,
5373,4394,5898,6144,4874,1793,3997,6334,4085,4214,5106,5642,4909,5799,6009,4419,
4189,3330,5899,4165,4420,5299,5720,5227,3347,6145,4081,6335,2876,3930,6146,3293,
3786,3910,3998,5900,5300,5578,2840,6563,5901,5579,6147,3531,5374,6564,6565,5580,
4759,5375,6566,6148,3559,5643,6336,6010,5517,6337,6338,5721,5902,3873,6011,6339,
6567,5518,3868,3649,5722,6568,4771,4947,6569,6149,4812,6570,2853,5471,6340,6341,
5644,4795,6342,6012,5723,6343,5724,6013,4349,6344,3160,6150,5193,4599,4514,4493,
5168,4320,6345,4927,3666,4745,5169,5903,5005,4928,6346,5725,6014,4730,4203,5046,
4948,3395,5170,6015,4150,6016,5726,5519,6347,5047,3550,6151,6348,4197,4310,5904,
6571,5581,2965,6152,4978,3960,4291,5135,6572,5301,5727,4129,4026,5905,4853,5728,
5472,6153,6349,4533,2700,4505,5336,4678,3583,5073,2994,4486,3043,4554,5520,6350,
6017,5800,4487,6351,3931,4103,5376,6352,4011,4321,4311,4190,5136,6018,3988,3233,
4350,5906,5645,4198,6573,5107,3432,4191,3435,5582,6574,4139,5410,6353,5411,3944,
5583,5074,3198,6575,6354,4358,6576,5302,4600,5584,5194,5412,6577,6578,5585,5413,
5303,4248,5414,3879,4433,6579,4479,5025,4854,5415,6355,4760,4772,3683,2978,4700,
3797,4452,3965,3932,3721,4910,5801,6580,5195,3551,5907,3221,3471,3029,6019,3999,
5908,5909,5266,5267,3444,3023,3828,3170,4796,5646,4979,4259,6356,5647,5337,3694,
6357,5648,5338,4520,4322,5802,3031,3759,4071,6020,5586,4836,4386,5048,6581,3571,
4679,4174,4949,6154,4813,3787,3402,3822,3958,3215,3552,5268,4387,3933,4950,4359,
6021,5910,5075,3579,6358,4234,4566,5521,6359,3613,5049,6022,5911,3375,3702,3178,
4911,5339,4521,6582,6583,4395,3087,3811,5377,6023,6360,6155,4027,5171,5649,4421,
4249,2804,6584,2270,6585,4000,4235,3045,6156,5137,5729,4140,4312,3886,6361,4330,
6157,4215,6158,3500,3676,4929,4331,3713,4930,5912,4265,3776,3368,5587,4470,4855,
3038,4980,3631,6159,6160,4132,4680,6161,6362,3923,4379,5588,4255,6586,4121,6587,
6363,4649,6364,3288,4773,4774,6162,6024,6365,3543,6588,4274,3107,3737,5050,5803,
4797,4522,5589,5051,5730,3714,4887,5378,4001,4523,6163,5026,5522,4701,4175,2791,
3760,6589,5473,4224,4133,3847,4814,4815,4775,3259,5416,6590,2738,6164,6025,5304,
3733,5076,5650,4816,5590,6591,6165,6592,3934,5269,6593,3396,5340,6594,5804,3445,
3602,4042,4488,5731,5732,3525,5591,4601,5196,6166,6026,5172,3642,4612,3202,4506,
4798,6366,3818,5108,4303,5138,5139,4776,3332,4304,2915,3415,4434,5077,5109,4856,
2879,5305,4817,6595,5913,3104,3144,3903,4634,5341,3133,5110,5651,5805,6167,4057,
5592,2945,4371,5593,6596,3474,4182,6367,6597,6168,4507,4279,6598,2822,6599,4777,
4713,5594,3829,6169,3887,5417,6170,3653,5474,6368,4216,2971,5228,3790,4579,6369,
5733,6600,6601,4951,4746,4555,6602,5418,5475,6027,3400,4665,5806,6171,4799,6028,
5052,6172,3343,4800,4747,5006,6370,4556,4217,5476,4396,5229,5379,5477,3839,5914,
5652,5807,4714,3068,4635,5808,6173,5342,4192,5078,5419,5523,5734,6174,4557,6175,
4602,6371,6176,6603,5809,6372,5735,4260,3869,5111,5230,6029,5112,6177,3126,4681,
5524,5915,2706,3563,4748,3130,6178,4018,5525,6604,6605,5478,4012,4837,6606,4534,
4193,5810,4857,3615,5479,6030,4082,3697,3539,4086,5270,3662,4508,4931,5916,4912,
5811,5027,3888,6607,4397,3527,3302,3798,2775,2921,2637,3966,4122,4388,4028,4054,
1633,4858,5079,3024,5007,3982,3412,5736,6608,3426,3236,5595,3030,6179,3427,3336,
3279,3110,6373,3874,3039,5080,5917,5140,4489,3119,6374,5812,3405,4494,6031,4666,
4141,6180,4166,6032,5813,4981,6609,5081,4422,4982,4112,3915,5653,3296,3983,6375,
4266,4410,5654,6610,6181,3436,5082,6611,5380,6033,3819,5596,4535,5231,5306,5113,
6612,4952,5918,4275,3113,6613,6376,6182,6183,5814,3073,4731,4838,5008,3831,6614,
4888,3090,3848,4280,5526,5232,3014,5655,5009,5737,5420,5527,6615,5815,5343,5173,
5381,4818,6616,3151,4953,6617,5738,2796,3204,4360,2989,4281,5739,5174,5421,5197,
3132,5141,3849,5142,5528,5083,3799,3904,4839,5480,2880,4495,3448,6377,6184,5271,
5919,3771,3193,6034,6035,5920,5010,6036,5597,6037,6378,6038,3106,5422,6618,5423,
5424,4142,6619,4889,5084,4890,4313,5740,6620,3437,5175,5307,5816,4199,5198,5529,
5817,5199,5656,4913,5028,5344,3850,6185,2955,5272,5011,5818,4567,4580,5029,5921,
3616,5233,6621,6622,6186,4176,6039,6379,6380,3352,5200,5273,2908,5598,5234,3837,
5308,6623,6624,5819,4496,4323,5309,5201,6625,6626,4983,3194,3838,4167,5530,5922,
5274,6381,6382,3860,3861,5599,3333,4292,4509,6383,3553,5481,5820,5531,4778,6187,
3955,3956,4324,4389,4218,3945,4325,3397,2681,5923,4779,5085,4019,5482,4891,5382,
5383,6040,4682,3425,5275,4094,6627,5310,3015,5483,5657,4398,5924,3168,4819,6628,
5925,6629,5532,4932,4613,6041,6630,4636,6384,4780,4204,5658,4423,5821,3989,4683,
5822,6385,4954,6631,5345,6188,5425,5012,5384,3894,6386,4490,4104,6632,5741,5053,
6633,5823,5926,5659,5660,5927,6634,5235,5742,5824,4840,4933,4820,6387,4859,5928,
4955,6388,4143,3584,5825,5346,5013,6635,5661,6389,5014,5484,5743,4337,5176,5662,
6390,2836,6391,3268,6392,6636,6042,5236,6637,4158,6638,5744,5663,4471,5347,3663,
4123,5143,4293,3895,6639,6640,5311,5929,5826,3800,6189,6393,6190,5664,5348,3554,
3594,4749,4603,6641,5385,4801,6043,5827,4183,6642,5312,5426,4761,6394,5665,6191,
4715,2669,6643,6644,5533,3185,5427,5086,5930,5931,5386,6192,6044,6645,4781,4013,
5745,4282,4435,5534,4390,4267,6045,5746,4984,6046,2743,6193,3501,4087,5485,5932,
5428,4184,4095,5747,4061,5054,3058,3862,5933,5600,6646,5144,3618,6395,3131,5055,
5313,6396,4650,4956,3855,6194,3896,5202,4985,4029,4225,6195,6647,5828,5486,5829,
3589,3002,6648,6397,4782,5276,6649,6196,6650,4105,3803,4043,5237,5830,6398,4096,
3643,6399,3528,6651,4453,3315,4637,6652,3984,6197,5535,3182,3339,6653,3096,2660,
6400,6654,3449,5934,4250,4236,6047,6401,5831,6655,5487,3753,4062,5832,6198,6199,
6656,3766,6657,3403,4667,6048,6658,4338,2897,5833,3880,2797,3780,4326,6659,5748,
5015,6660,5387,4351,5601,4411,6661,3654,4424,5935,4339,4072,5277,4568,5536,6402,
6662,5238,6663,5349,5203,6200,5204,6201,5145,4536,5016,5056,4762,5834,4399,4957,
6202,6403,5666,5749,6664,4340,6665,5936,5177,5667,6666,6667,3459,4668,6404,6668,
6669,4543,6203,6670,4276,6405,4480,5537,6671,4614,5205,5668,6672,3348,2193,4763,
6406,6204,5937,5602,4177,5669,3419,6673,4020,6205,4443,4569,5388,3715,3639,6407,
6049,4058,6206,6674,5938,4544,6050,4185,4294,4841,4651,4615,5488,6207,6408,6051,
5178,3241,3509,5835,6208,4958,5836,4341,5489,5278,6209,2823,5538,5350,5206,5429,
6675,4638,4875,4073,3516,4684,4914,4860,5939,5603,5389,6052,5057,3237,5490,3791,
6676,6409,6677,4821,4915,4106,5351,5058,4243,5539,4244,5604,4842,4916,5239,3028,
3716,5837,5114,5605,5390,5940,5430,6210,4332,6678,5540,4732,3667,3840,6053,4305,
3408,5670,5541,6410,2744,5240,5750,6679,3234,5606,6680,5607,5671,3608,4283,4159,
4400,5352,4783,6681,6411,6682,4491,4802,6211,6412,5941,6413,6414,5542,5751,6683,
4669,3734,5942,6684,6415,5943,5059,3328,4670,4144,4268,6685,6686,6687,6688,4372,
3603,6689,5944,5491,4373,3440,6416,5543,4784,4822,5608,3792,4616,5838,5672,3514,
5391,6417,4892,6690,4639,6691,6054,5673,5839,6055,6692,6056,5392,6212,4038,5544,
5674,4497,6057,6693,5840,4284,5675,4021,4545,5609,6418,4454,6419,6213,4113,4472,
5314,3738,5087,5279,4074,5610,4959,4063,3179,4750,6058,6420,6214,3476,4498,4716,
5431,4960,4685,6215,5241,6694,6421,6216,6695,5841,5945,6422,3748,5946,5179,3905,
5752,5545,5947,4374,6217,4455,6423,4412,6218,4803,5353,6696,3832,5280,6219,4327,
4702,6220,6221,6059,4652,5432,6424,3749,4751,6425,5753,4986,5393,4917,5948,5030,
5754,4861,4733,6426,4703,6697,6222,4671,5949,4546,4961,5180,6223,5031,3316,5281,
6698,4862,4295,4934,5207,3644,6427,5842,5950,6428,6429,4570,5843,5282,6430,6224,
5088,3239,6060,6699,5844,5755,6061,6431,2701,5546,6432,5115,5676,4039,3993,3327,
4752,4425,5315,6433,3941,6434,5677,4617,4604,3074,4581,6225,5433,6435,6226,6062,
4823,5756,5116,6227,3717,5678,4717,5845,6436,5679,5846,6063,5847,6064,3977,3354,
6437,3863,5117,6228,5547,5394,4499,4524,6229,4605,6230,4306,4500,6700,5951,6065,
3693,5952,5089,4366,4918,6701,6231,5548,6232,6702,6438,4704,5434,6703,6704,5953,
4168,6705,5680,3420,6706,5242,4407,6066,3812,5757,5090,5954,4672,4525,3481,5681,
4618,5395,5354,5316,5955,6439,4962,6707,4526,6440,3465,4673,6067,6441,5682,6708,
5435,5492,5758,5683,4619,4571,4674,4804,4893,4686,5493,4753,6233,6068,4269,6442,
6234,5032,4705,5146,5243,5208,5848,6235,6443,4963,5033,4640,4226,6236,5849,3387,
6444,6445,4436,4437,5850,4843,5494,4785,4894,6709,4361,6710,5091,5956,3331,6237,
4987,5549,6069,6711,4342,3517,4473,5317,6070,6712,6071,4706,6446,5017,5355,6713,
6714,4988,5436,6447,4734,5759,6715,4735,4547,4456,4754,6448,5851,6449,6450,3547,
5852,5318,6451,6452,5092,4205,6716,6238,4620,4219,5611,6239,6072,4481,5760,5957,
5958,4059,6240,6453,4227,4537,6241,5761,4030,4186,5244,5209,3761,4457,4876,3337,
5495,5181,6242,5959,5319,5612,5684,5853,3493,5854,6073,4169,5613,5147,4895,6074,
5210,6717,5182,6718,3830,6243,2798,3841,6075,6244,5855,5614,3604,4606,5496,5685,
5118,5356,6719,6454,5960,5357,5961,6720,4145,3935,4621,5119,5962,4261,6721,6455,
4786,5963,4375,4582,6245,6246,6247,6076,5437,4877,5856,3376,4380,6248,4160,6722,
5148,6456,5211,6457,6723,4718,6458,6724,6249,5358,4044,3297,6459,6250,5857,5615,
5497,5245,6460,5498,6725,6251,6252,5550,3793,5499,2959,5396,6461,6462,4572,5093,
5500,5964,3806,4146,6463,4426,5762,5858,6077,6253,4755,3967,4220,5965,6254,4989,
5501,6464,4352,6726,6078,4764,2290,5246,3906,5438,5283,3767,4964,2861,5763,5094,
6255,6256,4622,5616,5859,5860,4707,6727,4285,4708,4824,5617,6257,5551,4787,5212,
4965,4935,4687,6465,6728,6466,5686,6079,3494,4413,2995,5247,5966,5618,6729,5967,
5764,5765,5687,5502,6730,6731,6080,5397,6467,4990,6258,6732,4538,5060,5619,6733,
4719,5688,5439,5018,5149,5284,5503,6734,6081,4607,6259,5120,3645,5861,4583,6260,
4584,4675,5620,4098,5440,6261,4863,2379,3306,4585,5552,5689,4586,5285,6735,4864,
6736,5286,6082,6737,4623,3010,4788,4381,4558,5621,4587,4896,3698,3161,5248,4353,
4045,6262,3754,5183,4588,6738,6263,6739,6740,5622,3936,6741,6468,6742,6264,5095,
6469,4991,5968,6743,4992,6744,6083,4897,6745,4256,5766,4307,3108,3968,4444,5287,
3889,4343,6084,4510,6085,4559,6086,4898,5969,6746,5623,5061,4919,5249,5250,5504,
5441,6265,5320,4878,3242,5862,5251,3428,6087,6747,4237,5624,5442,6266,5553,4539,
6748,2585,3533,5398,4262,6088,5150,4736,4438,6089,6267,5505,4966,6749,6268,6750,
6269,5288,5554,3650,6090,6091,4624,6092,5690,6751,5863,4270,5691,4277,5555,5864,
6752,5692,4720,4865,6470,5151,4688,4825,6753,3094,6754,6471,3235,4653,6755,5213,
5399,6756,3201,4589,5865,4967,6472,5866,6473,5019,3016,6757,5321,4756,3957,4573,
6093,4993,5767,4721,6474,6758,5625,6759,4458,6475,6270,6760,5556,4994,5214,5252,
6271,3875,5768,6094,5034,5506,4376,5769,6761,2120,6476,5253,5770,6762,5771,5970,
3990,5971,5557,5558,5772,6477,6095,2787,4641,5972,5121,6096,6097,6272,6763,3703,
5867,5507,6273,4206,6274,4789,6098,6764,3619,3646,3833,3804,2394,3788,4936,3978,
4866,4899,6099,6100,5559,6478,6765,3599,5868,6101,5869,5870,6275,6766,4527,6767
];


/*
 * The Original Code is Mozilla Universal charset detector code.
 *
 * The Initial Developer of the Original Code is
 * Netscape Communications Corporation.
 * Portions created by the Initial Developer are Copyright (C) 2001
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   António Afonso (antonio.afonso gmail.com) - port to JavaScript
 *   Mark Pilgrim - port to Python
 *   Shy Shalom - original C code
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301  USA
 */

// Sampling from about 20M text materials include literature and computer technology

// 128  --> 0.79
// 256  --> 0.92
// 512  --> 0.986
// 1024 --> 0.99944
// 2048 --> 0.99999
//
// Idea Distribution Ratio = 0.98653 / (1-0.98653) = 73.24
// Random Distribution Ration = 512 / (2350-512) = 0.279.
//
// Typical Distribution Ratio

jschardet.EUCKR_TYPICAL_DISTRIBUTION_RATIO = 6.0;

jschardet.EUCKR_TABLE_SIZE = 2352;

// Char to FreqOrder table ,
jschardet.EUCKRCharToFreqOrder = [
  13, 130, 120,1396, 481,1719,1720, 328, 609, 212,1721, 707, 400, 299,1722,  87,
1397,1723, 104, 536,1117,1203,1724,1267, 685,1268, 508,1725,1726,1727,1728,1398,
1399,1729,1730,1731, 141, 621, 326,1057, 368,1732, 267, 488,  20,1733,1269,1734,
 945,1400,1735,  47, 904,1270,1736,1737, 773, 248,1738, 409, 313, 786, 429,1739,
 116, 987, 813,1401, 683,  75,1204, 145,1740,1741,1742,1743,  16, 847, 667, 622,
 708,1744,1745,1746, 966, 787, 304, 129,1747,  60, 820, 123, 676,1748,1749,1750,
1751, 617,1752, 626,1753,1754,1755,1756, 653,1757,1758,1759,1760,1761,1762, 856,
 344,1763,1764,1765,1766,  89, 401, 418, 806, 905, 848,1767,1768,1769, 946,1205,
 709,1770,1118,1771, 241,1772,1773,1774,1271,1775, 569,1776, 999,1777,1778,1779,
1780, 337, 751,1058,  28, 628, 254,1781, 177, 906, 270, 349, 891,1079,1782,  19,
1783, 379,1784, 315,1785, 629, 754,1402, 559,1786, 636, 203,1206,1787, 710, 567,
1788, 935, 814,1789,1790,1207, 766, 528,1791,1792,1208,1793,1794,1795,1796,1797,
1403,1798,1799, 533,1059,1404,1405,1156,1406, 936, 884,1080,1800, 351,1801,1802,
1803,1804,1805, 801,1806,1807,1808,1119,1809,1157, 714, 474,1407,1810, 298, 899,
 885,1811,1120, 802,1158,1812, 892,1813,1814,1408, 659,1815,1816,1121,1817,1818,
1819,1820,1821,1822, 319,1823, 594, 545,1824, 815, 937,1209,1825,1826, 573,1409,
1022,1827,1210,1828,1829,1830,1831,1832,1833, 556, 722, 807,1122,1060,1834, 697,
1835, 900, 557, 715,1836,1410, 540,1411, 752,1159, 294, 597,1211, 976, 803, 770,
1412,1837,1838,  39, 794,1413, 358,1839, 371, 925,1840, 453, 661, 788, 531, 723,
 544,1023,1081, 869,  91,1841, 392, 430, 790, 602,1414, 677,1082, 457,1415,1416,
1842,1843, 475, 327,1024,1417, 795, 121,1844, 733, 403,1418,1845,1846,1847, 300,
 119, 711,1212, 627,1848,1272, 207,1849,1850, 796,1213, 382,1851, 519,1852,1083,
 893,1853,1854,1855, 367, 809, 487, 671,1856, 663,1857,1858, 956, 471, 306, 857,
1859,1860,1160,1084,1861,1862,1863,1864,1865,1061,1866,1867,1868,1869,1870,1871,
 282,  96, 574,1872, 502,1085,1873,1214,1874, 907,1875,1876, 827, 977,1419,1420,
1421, 268,1877,1422,1878,1879,1880, 308,1881,   2, 537,1882,1883,1215,1884,1885,
 127, 791,1886,1273,1423,1887,  34, 336, 404, 643,1888, 571, 654, 894, 840,1889,
   0, 886,1274, 122, 575, 260, 908, 938,1890,1275, 410, 316,1891,1892, 100,1893,
1894,1123,  48,1161,1124,1025,1895, 633, 901,1276,1896,1897, 115, 816,1898, 317,
1899, 694,1900, 909, 734,1424, 572, 866,1425, 691,  85, 524,1010, 543, 394, 841,
1901,1902,1903,1026,1904,1905,1906,1907,1908,1909,  30, 451, 651, 988, 310,1910,
1911,1426, 810,1216,  93,1912,1913,1277,1217,1914, 858, 759,  45,  58, 181, 610,
 269,1915,1916, 131,1062, 551, 443,1000, 821,1427, 957, 895,1086,1917,1918, 375,
1919, 359,1920, 687,1921, 822,1922, 293,1923,1924,  40, 662, 118, 692,  29, 939,
 887, 640, 482, 174,1925,  69,1162, 728,1428, 910,1926,1278,1218,1279, 386, 870,
 217, 854,1163, 823,1927,1928,1929,1930, 834,1931,  78,1932, 859,1933,1063,1934,
1935,1936,1937, 438,1164, 208, 595,1938,1939,1940,1941,1219,1125,1942, 280, 888,
1429,1430,1220,1431,1943,1944,1945,1946,1947,1280, 150, 510,1432,1948,1949,1950,
1951,1952,1953,1954,1011,1087,1955,1433,1043,1956, 881,1957, 614, 958,1064,1065,
1221,1958, 638,1001, 860, 967, 896,1434, 989, 492, 553,1281,1165,1959,1282,1002,
1283,1222,1960,1961,1962,1963,  36, 383, 228, 753, 247, 454,1964, 876, 678,1965,
1966,1284, 126, 464, 490, 835, 136, 672, 529, 940,1088,1435, 473,1967,1968, 467,
  50, 390, 227, 587, 279, 378, 598, 792, 968, 240, 151, 160, 849, 882,1126,1285,
 639,1044, 133, 140, 288, 360, 811, 563,1027, 561, 142, 523,1969,1970,1971,   7,
 103, 296, 439, 407, 506, 634, 990,1972,1973,1974,1975, 645,1976,1977,1978,1979,
1980,1981, 236,1982,1436,1983,1984,1089, 192, 828, 618, 518,1166, 333,1127,1985,
 818,1223,1986,1987,1988,1989,1990,1991,1992,1993, 342,1128,1286, 746, 842,1994,
1995, 560, 223,1287,  98,   8, 189, 650, 978,1288,1996,1437,1997,  17, 345, 250,
 423, 277, 234, 512, 226,  97, 289,  42, 167,1998, 201,1999,2000, 843, 836, 824,
 532, 338, 783,1090, 182, 576, 436,1438,1439, 527, 500,2001, 947, 889,2002,2003,
2004,2005, 262, 600, 314, 447,2006, 547,2007, 693, 738,1129,2008,  71,1440, 745,
 619, 688,2009, 829,2010,2011, 147,2012,  33, 948,2013,2014,  74, 224,2015,  61,
 191, 918, 399, 637,2016,1028,1130, 257, 902,2017,2018,2019,2020,2021,2022,2023,
2024,2025,2026, 837,2027,2028,2029,2030, 179, 874, 591,  52, 724, 246,2031,2032,
2033,2034,1167, 969,2035,1289, 630, 605, 911,1091,1168,2036,2037,2038,1441, 912,
2039, 623,2040,2041, 253,1169,1290,2042,1442, 146, 620, 611, 577, 433,2043,1224,
 719,1170, 959, 440, 437, 534,  84, 388, 480,1131, 159, 220, 198, 679,2044,1012,
 819,1066,1443, 113,1225, 194, 318,1003,1029,2045,2046,2047,2048,1067,2049,2050,
2051,2052,2053,  59, 913, 112,2054, 632,2055, 455, 144, 739,1291,2056, 273, 681,
 499,2057, 448,2058,2059, 760,2060,2061, 970, 384, 169, 245,1132,2062,2063, 414,
1444,2064,2065,  41, 235,2066, 157, 252, 877, 568, 919, 789, 580,2067, 725,2068,
2069,1292,2070,2071,1445,2072,1446,2073,2074,  55, 588,  66,1447, 271,1092,2075,
1226,2076, 960,1013, 372,2077,2078,2079,2080,2081,1293,2082,2083,2084,2085, 850,
2086,2087,2088,2089,2090, 186,2091,1068, 180,2092,2093,2094, 109,1227, 522, 606,
2095, 867,1448,1093, 991,1171, 926, 353,1133,2096, 581,2097,2098,2099,1294,1449,
1450,2100, 596,1172,1014,1228,2101,1451,1295,1173,1229,2102,2103,1296,1134,1452,
 949,1135,2104,2105,1094,1453,1454,1455,2106,1095,2107,2108,2109,2110,2111,2112,
2113,2114,2115,2116,2117, 804,2118,2119,1230,1231, 805,1456, 405,1136,2120,2121,
2122,2123,2124, 720, 701,1297, 992,1457, 927,1004,2125,2126,2127,2128,2129,2130,
  22, 417,2131, 303,2132, 385,2133, 971, 520, 513,2134,1174,  73,1096, 231, 274,
 962,1458, 673,2135,1459,2136, 152,1137,2137,2138,2139,2140,1005,1138,1460,1139,
2141,2142,2143,2144,  11, 374, 844,2145, 154,1232,  46,1461,2146, 838, 830, 721,
1233, 106,2147,  90, 428, 462, 578, 566,1175, 352,2148,2149, 538,1234, 124,1298,
2150,1462, 761, 565,2151, 686,2152, 649,2153,  72, 173,2154, 460, 415,2155,1463,
2156,1235, 305,2157,2158,2159,2160,2161,2162, 579,2163,2164,2165,2166,2167, 747,
2168,2169,2170,2171,1464, 669,2172,2173,2174,2175,2176,1465,2177,  23, 530, 285,
2178, 335, 729,2179, 397,2180,2181,2182,1030,2183,2184, 698,2185,2186, 325,2187,
2188, 369,2189, 799,1097,1015, 348,2190,1069, 680,2191, 851,1466,2192,2193,  10,
2194, 613, 424,2195, 979, 108, 449, 589,  27, 172,  81,1031,  80, 774, 281, 350,
1032, 525, 301, 582,1176,2196, 674,1045,2197,2198,1467, 730, 762,2199,2200,2201,
2202,1468,2203, 993,2204,2205, 266,1070, 963,1140,2206,2207,2208, 664,1098, 972,
2209,2210,2211,1177,1469,1470, 871,2212,2213,2214,2215,2216,1471,2217,2218,2219,
2220,2221,2222,2223,2224,2225,2226,2227,1472,1236,2228,2229,2230,2231,2232,2233,
2234,2235,1299,2236,2237, 200,2238, 477, 373,2239,2240, 731, 825, 777,2241,2242,
2243, 521, 486, 548,2244,2245,2246,1473,1300,  53, 549, 137, 875,  76, 158,2247,
1301,1474, 469, 396,1016, 278, 712,2248, 321, 442, 503, 767, 744, 941,1237,1178,
1475,2249,  82, 178,1141,1179, 973,2250,1302,2251, 297,2252,2253, 570,2254,2255,
2256,  18, 450, 206,2257, 290, 292,1142,2258, 511, 162,  99, 346, 164, 735,2259,
1476,1477,   4, 554, 343, 798,1099,2260,1100,2261,  43, 171,1303, 139, 215,2262,
2263, 717, 775,2264,1033, 322, 216,2265, 831,2266, 149,2267,1304,2268,2269, 702,
1238, 135, 845, 347, 309,2270, 484,2271, 878, 655, 238,1006,1478,2272,  67,2273,
 295,2274,2275, 461,2276, 478, 942, 412,2277,1034,2278,2279,2280, 265,2281, 541,
2282,2283,2284,2285,2286,  70, 852,1071,2287,2288,2289,2290,  21,  56, 509, 117,
 432,2291,2292, 331, 980, 552,1101, 148, 284, 105, 393,1180,1239, 755,2293, 187,
2294,1046,1479,2295, 340,2296,  63,1047, 230,2297,2298,1305, 763,1306, 101, 800,
 808, 494,2299,2300,2301, 903,2302,  37,1072,  14,   5,2303,  79, 675,2304, 312,
2305,2306,2307,2308,2309,1480,   6,1307,2310,2311,2312,   1, 470,  35,  24, 229,
2313, 695, 210,  86, 778,  15, 784, 592, 779,  32,  77, 855, 964,2314, 259,2315,
 501, 380,2316,2317,  83, 981, 153, 689,1308,1481,1482,1483,2318,2319, 716,1484,
2320,2321,2322,2323,2324,2325,1485,2326,2327, 128,  57,  68, 261,1048, 211, 170,
1240,  31,2328,  51, 435, 742,2329,2330,2331, 635,2332, 264, 456,2333,2334,2335,
 425,2336,1486, 143, 507, 263, 943,2337, 363, 920,1487, 256,1488,1102, 243, 601,
1489,2338,2339,2340,2341,2342,2343,2344, 861,2345,2346,2347,2348,2349,2350, 395,
2351,1490,1491,  62, 535, 166, 225,2352,2353, 668, 419,1241, 138, 604, 928,2354,
1181,2355,1492,1493,2356,2357,2358,1143,2359, 696,2360, 387, 307,1309, 682, 476,
2361,2362, 332,  12, 222, 156,2363, 232,2364, 641, 276, 656, 517,1494,1495,1035,
 416, 736,1496,2365,1017, 586,2366,2367,2368,1497,2369, 242,2370,2371,2372,1498,
2373, 965, 713,2374,2375,2376,2377, 740, 982,1499, 944,1500,1007,2378,2379,1310,
1501,2380,2381,2382, 785, 329,2383,2384,1502,2385,2386,2387, 932,2388,1503,2389,
2390,2391,2392,1242,2393,2394,2395,2396,2397, 994, 950,2398,2399,2400,2401,1504,
1311,2402,2403,2404,2405,1049, 749,2406,2407, 853, 718,1144,1312,2408,1182,1505,
2409,2410, 255, 516, 479, 564, 550, 214,1506,1507,1313, 413, 239, 444, 339,1145,
1036,1508,1509,1314,1037,1510,1315,2411,1511,2412,2413,2414, 176, 703, 497, 624,
 593, 921, 302,2415, 341, 165,1103,1512,2416,1513,2417,2418,2419, 376,2420, 700,
2421,2422,2423, 258, 768,1316,2424,1183,2425, 995, 608,2426,2427,2428,2429, 221,
2430,2431,2432,2433,2434,2435,2436,2437, 195, 323, 726, 188, 897, 983,1317, 377,
 644,1050, 879,2438, 452,2439,2440,2441,2442,2443,2444, 914,2445,2446,2447,2448,
 915, 489,2449,1514,1184,2450,2451, 515,  64, 427, 495,2452, 583,2453, 483, 485,
1038, 562, 213,1515, 748, 666,2454,2455,2456,2457, 334,2458, 780, 996,1008, 705,
1243,2459,2460,2461,2462,2463, 114,2464, 493,1146, 366, 163,1516, 961,1104,2465,
 291,2466,1318,1105,2467,1517, 365,2468, 355, 951,1244,2469,1319,2470, 631,2471,
2472, 218,1320, 364, 320, 756,1518,1519,1321,1520,1322,2473,2474,2475,2476, 997,
2477,2478,2479,2480, 665,1185,2481, 916,1521,2482,2483,2484, 584, 684,2485,2486,
 797,2487,1051,1186,2488,2489,2490,1522,2491,2492, 370,2493,1039,1187,  65,2494,
 434, 205, 463,1188,2495, 125, 812, 391, 402, 826, 699, 286, 398, 155, 781, 771,
 585,2496, 590, 505,1073,2497, 599, 244, 219, 917,1018, 952, 646,1523,2498,1323,
2499,2500,  49, 984, 354, 741,2501, 625,2502,1324,2503,1019, 190, 357, 757, 491,
  95, 782, 868,2504,2505,2506,2507,2508,2509, 134,1524,1074, 422,1525, 898,2510,
 161,2511,2512,2513,2514, 769,2515,1526,2516,2517, 411,1325,2518, 472,1527,2519,
2520,2521,2522,2523,2524, 985,2525,2526,2527,2528,2529,2530, 764,2531,1245,2532,
2533,  25, 204, 311,2534, 496,2535,1052,2536,2537,2538,2539,2540,2541,2542, 199,
 704, 504, 468, 758, 657,1528, 196,  44, 839,1246, 272, 750,2543, 765, 862,2544,
2545,1326,2546, 132, 615, 933,2547, 732,2548,2549,2550,1189,1529,2551, 283,1247,
1053, 607, 929,2552,2553,2554, 930, 183, 872, 616,1040,1147,2555,1148,1020, 441,
 249,1075,2556,2557,2558, 466, 743,2559,2560,2561,  92, 514, 426, 420, 526,2562,
2563,2564,2565,2566,2567,2568, 185,2569,2570,2571,2572, 776,1530, 658,2573, 362,
2574, 361, 922,1076, 793,2575,2576,2577,2578,2579,2580,1531, 251,2581,2582,2583,
2584,1532,  54, 612, 237,1327,2585,2586, 275, 408, 647, 111,2587,1533,1106, 465,
   3, 458,   9,  38,2588, 107, 110, 890, 209,  26, 737, 498,2589,1534,2590, 431,
 202,  88,1535, 356, 287,1107, 660,1149,2591, 381,1536, 986,1150, 445,1248,1151,
 974,2592,2593, 846,2594, 446, 953, 184,1249,1250, 727,2595, 923, 193, 883,2596,
2597,2598, 102, 324, 539, 817,2599, 421,1041,2600, 832,2601,  94, 175, 197, 406,
2602, 459,2603,2604,2605,2606,2607, 330, 555,2608,2609,2610, 706,1108, 389,2611,
2612,2613,2614, 233,2615, 833, 558, 931, 954,1251,2616,2617,1537, 546,2618,2619,
1009,2620,2621,2622,1538, 690,1328,2623, 955,2624,1539,2625,2626, 772,2627,2628,
2629,2630,2631, 924, 648, 863, 603,2632,2633, 934,1540, 864, 865,2634, 642,1042,
 670,1190,2635,2636,2637,2638, 168,2639, 652, 873, 542,1054,1541,2640,2641,2642,  // 512, 256
//Everything below is of no interest for detection purpose
2643,2644,2645,2646,2647,2648,2649,2650,2651,2652,2653,2654,2655,2656,2657,2658,
2659,2660,2661,2662,2663,2664,2665,2666,2667,2668,2669,2670,2671,2672,2673,2674,
2675,2676,2677,2678,2679,2680,2681,2682,2683,2684,2685,2686,2687,2688,2689,2690,
2691,2692,2693,2694,2695,2696,2697,2698,2699,1542, 880,2700,2701,2702,2703,2704,
2705,2706,2707,2708,2709,2710,2711,2712,2713,2714,2715,2716,2717,2718,2719,2720,
2721,2722,2723,2724,2725,1543,2726,2727,2728,2729,2730,2731,2732,1544,2733,2734,
2735,2736,2737,2738,2739,2740,2741,2742,2743,2744,2745,2746,2747,2748,2749,2750,
2751,2752,2753,2754,1545,2755,2756,2757,2758,2759,2760,2761,2762,2763,2764,2765,
2766,1546,2767,1547,2768,2769,2770,2771,2772,2773,2774,2775,2776,2777,2778,2779,
2780,2781,2782,2783,2784,2785,2786,1548,2787,2788,2789,1109,2790,2791,2792,2793,
2794,2795,2796,2797,2798,2799,2800,2801,2802,2803,2804,2805,2806,2807,2808,2809,
2810,2811,2812,1329,2813,2814,2815,2816,2817,2818,2819,2820,2821,2822,2823,2824,
2825,2826,2827,2828,2829,2830,2831,2832,2833,2834,2835,2836,2837,2838,2839,2840,
2841,2842,2843,2844,2845,2846,2847,2848,2849,2850,2851,2852,2853,2854,2855,2856,
1549,2857,2858,2859,2860,1550,2861,2862,1551,2863,2864,2865,2866,2867,2868,2869,
2870,2871,2872,2873,2874,1110,1330,2875,2876,2877,2878,2879,2880,2881,2882,2883,
2884,2885,2886,2887,2888,2889,2890,2891,2892,2893,2894,2895,2896,2897,2898,2899,
2900,2901,2902,2903,2904,2905,2906,2907,2908,2909,2910,2911,2912,2913,2914,2915,
2916,2917,2918,2919,2920,2921,2922,2923,2924,2925,2926,2927,2928,2929,2930,1331,
2931,2932,2933,2934,2935,2936,2937,2938,2939,2940,2941,2942,2943,1552,2944,2945,
2946,2947,2948,2949,2950,2951,2952,2953,2954,2955,2956,2957,2958,2959,2960,2961,
2962,2963,2964,1252,2965,2966,2967,2968,2969,2970,2971,2972,2973,2974,2975,2976,
2977,2978,2979,2980,2981,2982,2983,2984,2985,2986,2987,2988,2989,2990,2991,2992,
2993,2994,2995,2996,2997,2998,2999,3000,3001,3002,3003,3004,3005,3006,3007,3008,
3009,3010,3011,3012,1553,3013,3014,3015,3016,3017,1554,3018,1332,3019,3020,3021,
3022,3023,3024,3025,3026,3027,3028,3029,3030,3031,3032,3033,3034,3035,3036,3037,
3038,3039,3040,3041,3042,3043,3044,3045,3046,3047,3048,3049,3050,1555,3051,3052,
3053,1556,1557,3054,3055,3056,3057,3058,3059,3060,3061,3062,3063,3064,3065,3066,
3067,1558,3068,3069,3070,3071,3072,3073,3074,3075,3076,1559,3077,3078,3079,3080,
3081,3082,3083,1253,3084,3085,3086,3087,3088,3089,3090,3091,3092,3093,3094,3095,
3096,3097,3098,3099,3100,3101,3102,3103,3104,3105,3106,3107,3108,1152,3109,3110,
3111,3112,3113,1560,3114,3115,3116,3117,1111,3118,3119,3120,3121,3122,3123,3124,
3125,3126,3127,3128,3129,3130,3131,3132,3133,3134,3135,3136,3137,3138,3139,3140,
3141,3142,3143,3144,3145,3146,3147,3148,3149,3150,3151,3152,3153,3154,3155,3156,
3157,3158,3159,3160,3161,3162,3163,3164,3165,3166,3167,3168,3169,3170,3171,3172,
3173,3174,3175,3176,1333,3177,3178,3179,3180,3181,3182,3183,3184,3185,3186,3187,
3188,3189,1561,3190,3191,1334,3192,3193,3194,3195,3196,3197,3198,3199,3200,3201,
3202,3203,3204,3205,3206,3207,3208,3209,3210,3211,3212,3213,3214,3215,3216,3217,
3218,3219,3220,3221,3222,3223,3224,3225,3226,3227,3228,3229,3230,3231,3232,3233,
3234,1562,3235,3236,3237,3238,3239,3240,3241,3242,3243,3244,3245,3246,3247,3248,
3249,3250,3251,3252,3253,3254,3255,3256,3257,3258,3259,3260,3261,3262,3263,3264,
3265,3266,3267,3268,3269,3270,3271,3272,3273,3274,3275,3276,3277,1563,3278,3279,
3280,3281,3282,3283,3284,3285,3286,3287,3288,3289,3290,3291,3292,3293,3294,3295,
3296,3297,3298,3299,3300,3301,3302,3303,3304,3305,3306,3307,3308,3309,3310,3311,
3312,3313,3314,3315,3316,3317,3318,3319,3320,3321,3322,3323,3324,3325,3326,3327,
3328,3329,3330,3331,3332,3333,3334,3335,3336,3337,3338,3339,3340,3341,3342,3343,
3344,3345,3346,3347,3348,3349,3350,3351,3352,3353,3354,3355,3356,3357,3358,3359,
3360,3361,3362,3363,3364,1335,3365,3366,3367,3368,3369,3370,3371,3372,3373,3374,
3375,3376,3377,3378,3379,3380,3381,3382,3383,3384,3385,3386,3387,1336,3388,3389,
3390,3391,3392,3393,3394,3395,3396,3397,3398,3399,3400,3401,3402,3403,3404,3405,
3406,3407,3408,3409,3410,3411,3412,3413,3414,1337,3415,3416,3417,3418,3419,1338,
3420,3421,3422,1564,1565,3423,3424,3425,3426,3427,3428,3429,3430,3431,1254,3432,
3433,3434,1339,3435,3436,3437,3438,3439,1566,3440,3441,3442,3443,3444,3445,3446,
3447,3448,3449,3450,3451,3452,3453,3454,1255,3455,3456,3457,3458,3459,1567,1191,
3460,1568,1569,3461,3462,3463,1570,3464,3465,3466,3467,3468,1571,3469,3470,3471,
3472,3473,1572,3474,3475,3476,3477,3478,3479,3480,3481,3482,3483,3484,3485,3486,
1340,3487,3488,3489,3490,3491,3492,1021,3493,3494,3495,3496,3497,3498,1573,3499,
1341,3500,3501,3502,3503,3504,3505,3506,3507,3508,3509,3510,3511,1342,3512,3513,
3514,3515,3516,1574,1343,3517,3518,3519,1575,3520,1576,3521,3522,3523,3524,3525,
3526,3527,3528,3529,3530,3531,3532,3533,3534,3535,3536,3537,3538,3539,3540,3541,
3542,3543,3544,3545,3546,3547,3548,3549,3550,3551,3552,3553,3554,3555,3556,3557,
3558,3559,3560,3561,3562,3563,3564,3565,3566,3567,3568,3569,3570,3571,3572,3573,
3574,3575,3576,3577,3578,3579,3580,1577,3581,3582,1578,3583,3584,3585,3586,3587,
3588,3589,3590,3591,3592,3593,3594,3595,3596,3597,3598,3599,3600,3601,3602,3603,
3604,1579,3605,3606,3607,3608,3609,3610,3611,3612,3613,3614,3615,3616,3617,3618,
3619,3620,3621,3622,3623,3624,3625,3626,3627,3628,3629,1580,3630,3631,1581,3632,
3633,3634,3635,3636,3637,3638,3639,3640,3641,3642,3643,3644,3645,3646,3647,3648,
3649,3650,3651,3652,3653,3654,3655,3656,1582,3657,3658,3659,3660,3661,3662,3663,
3664,3665,3666,3667,3668,3669,3670,3671,3672,3673,3674,3675,3676,3677,3678,3679,
3680,3681,3682,3683,3684,3685,3686,3687,3688,3689,3690,3691,3692,3693,3694,3695,
3696,3697,3698,3699,3700,1192,3701,3702,3703,3704,1256,3705,3706,3707,3708,1583,
1257,3709,3710,3711,3712,3713,3714,3715,3716,1584,3717,3718,3719,3720,3721,3722,
3723,3724,3725,3726,3727,3728,3729,3730,3731,3732,3733,3734,3735,3736,3737,3738,
3739,3740,3741,3742,3743,3744,3745,1344,3746,3747,3748,3749,3750,3751,3752,3753,
3754,3755,3756,1585,3757,3758,3759,3760,3761,3762,3763,3764,3765,3766,1586,3767,
3768,3769,3770,3771,3772,3773,3774,3775,3776,3777,3778,1345,3779,3780,3781,3782,
3783,3784,3785,3786,3787,3788,3789,3790,3791,3792,3793,3794,3795,1346,1587,3796,
3797,1588,3798,3799,3800,3801,3802,3803,3804,3805,3806,1347,3807,3808,3809,3810,
3811,1589,3812,3813,3814,3815,3816,3817,3818,3819,3820,3821,1590,3822,3823,1591,
1348,3824,3825,3826,3827,3828,3829,3830,1592,3831,3832,1593,3833,3834,3835,3836,
3837,3838,3839,3840,3841,3842,3843,3844,1349,3845,3846,3847,3848,3849,3850,3851,
3852,3853,3854,3855,3856,3857,3858,1594,3859,3860,3861,3862,3863,3864,3865,3866,
3867,3868,3869,1595,3870,3871,3872,3873,1596,3874,3875,3876,3877,3878,3879,3880,
3881,3882,3883,3884,3885,3886,1597,3887,3888,3889,3890,3891,3892,3893,3894,3895,
1598,3896,3897,3898,1599,1600,3899,1350,3900,1351,3901,3902,1352,3903,3904,3905,
3906,3907,3908,3909,3910,3911,3912,3913,3914,3915,3916,3917,3918,3919,3920,3921,
3922,3923,3924,1258,3925,3926,3927,3928,3929,3930,3931,1193,3932,1601,3933,3934,
3935,3936,3937,3938,3939,3940,3941,3942,3943,1602,3944,3945,3946,3947,3948,1603,
3949,3950,3951,3952,3953,3954,3955,3956,3957,3958,3959,3960,3961,3962,3963,3964,
3965,1604,3966,3967,3968,3969,3970,3971,3972,3973,3974,3975,3976,3977,1353,3978,
3979,3980,3981,3982,3983,3984,3985,3986,3987,3988,3989,3990,3991,1354,3992,3993,
3994,3995,3996,3997,3998,3999,4000,4001,4002,4003,4004,4005,4006,4007,4008,4009,
4010,4011,4012,4013,4014,4015,4016,4017,4018,4019,4020,4021,4022,4023,1355,4024,
4025,4026,4027,4028,4029,4030,4031,4032,4033,4034,4035,4036,4037,4038,4039,4040,
1605,4041,4042,4043,4044,4045,4046,4047,4048,4049,4050,4051,4052,4053,4054,4055,
4056,4057,4058,4059,4060,1606,4061,4062,4063,4064,1607,4065,4066,4067,4068,4069,
4070,4071,4072,4073,4074,4075,4076,1194,4077,4078,1608,4079,4080,4081,4082,4083,
4084,4085,4086,4087,1609,4088,4089,4090,4091,4092,4093,4094,4095,4096,4097,4098,
4099,4100,4101,4102,4103,4104,4105,4106,4107,4108,1259,4109,4110,4111,4112,4113,
4114,4115,4116,4117,4118,4119,4120,4121,4122,4123,4124,1195,4125,4126,4127,1610,
4128,4129,4130,4131,4132,4133,4134,4135,4136,4137,1356,4138,4139,4140,4141,4142,
4143,4144,1611,4145,4146,4147,4148,4149,4150,4151,4152,4153,4154,4155,4156,4157,
4158,4159,4160,4161,4162,4163,4164,4165,4166,4167,4168,4169,4170,4171,4172,4173,
4174,4175,4176,4177,4178,4179,4180,4181,4182,4183,4184,4185,4186,4187,4188,4189,
4190,4191,4192,4193,4194,4195,4196,4197,4198,4199,4200,4201,4202,4203,4204,4205,
4206,4207,4208,4209,4210,4211,4212,4213,4214,4215,4216,4217,4218,4219,1612,4220,
4221,4222,4223,4224,4225,4226,4227,1357,4228,1613,4229,4230,4231,4232,4233,4234,
4235,4236,4237,4238,4239,4240,4241,4242,4243,1614,4244,4245,4246,4247,4248,4249,
4250,4251,4252,4253,4254,4255,4256,4257,4258,4259,4260,4261,4262,4263,4264,4265,
4266,4267,4268,4269,4270,1196,1358,4271,4272,4273,4274,4275,4276,4277,4278,4279,
4280,4281,4282,4283,4284,4285,4286,4287,1615,4288,4289,4290,4291,4292,4293,4294,
4295,4296,4297,4298,4299,4300,4301,4302,4303,4304,4305,4306,4307,4308,4309,4310,
4311,4312,4313,4314,4315,4316,4317,4318,4319,4320,4321,4322,4323,4324,4325,4326,
4327,4328,4329,4330,4331,4332,4333,4334,1616,4335,4336,4337,4338,4339,4340,4341,
4342,4343,4344,4345,4346,4347,4348,4349,4350,4351,4352,4353,4354,4355,4356,4357,
4358,4359,4360,1617,4361,4362,4363,4364,4365,1618,4366,4367,4368,4369,4370,4371,
4372,4373,4374,4375,4376,4377,4378,4379,4380,4381,4382,4383,4384,4385,4386,4387,
4388,4389,4390,4391,4392,4393,4394,4395,4396,4397,4398,4399,4400,4401,4402,4403,
4404,4405,4406,4407,4408,4409,4410,4411,4412,4413,4414,4415,4416,1619,4417,4418,
4419,4420,4421,4422,4423,4424,4425,1112,4426,4427,4428,4429,4430,1620,4431,4432,
4433,4434,4435,4436,4437,4438,4439,4440,4441,4442,1260,1261,4443,4444,4445,4446,
4447,4448,4449,4450,4451,4452,4453,4454,4455,1359,4456,4457,4458,4459,4460,4461,
4462,4463,4464,4465,1621,4466,4467,4468,4469,4470,4471,4472,4473,4474,4475,4476,
4477,4478,4479,4480,4481,4482,4483,4484,4485,4486,4487,4488,4489,1055,4490,4491,
4492,4493,4494,4495,4496,4497,4498,4499,4500,4501,4502,4503,4504,4505,4506,4507,
4508,4509,4510,4511,4512,4513,4514,4515,4516,4517,4518,1622,4519,4520,4521,1623,
4522,4523,4524,4525,4526,4527,4528,4529,4530,4531,4532,4533,4534,4535,1360,4536,
4537,4538,4539,4540,4541,4542,4543, 975,4544,4545,4546,4547,4548,4549,4550,4551,
4552,4553,4554,4555,4556,4557,4558,4559,4560,4561,4562,4563,4564,4565,4566,4567,
4568,4569,4570,4571,1624,4572,4573,4574,4575,4576,1625,4577,4578,4579,4580,4581,
4582,4583,4584,1626,4585,4586,4587,4588,4589,4590,4591,4592,4593,4594,4595,1627,
4596,4597,4598,4599,4600,4601,4602,4603,4604,4605,4606,4607,4608,4609,4610,4611,
4612,4613,4614,4615,1628,4616,4617,4618,4619,4620,4621,4622,4623,4624,4625,4626,
4627,4628,4629,4630,4631,4632,4633,4634,4635,4636,4637,4638,4639,4640,4641,4642,
4643,4644,4645,4646,4647,4648,4649,1361,4650,4651,4652,4653,4654,4655,4656,4657,
4658,4659,4660,4661,1362,4662,4663,4664,4665,4666,4667,4668,4669,4670,4671,4672,
4673,4674,4675,4676,4677,4678,4679,4680,4681,4682,1629,4683,4684,4685,4686,4687,
1630,4688,4689,4690,4691,1153,4692,4693,4694,1113,4695,4696,4697,4698,4699,4700,
4701,4702,4703,4704,4705,4706,4707,4708,4709,4710,4711,1197,4712,4713,4714,4715,
4716,4717,4718,4719,4720,4721,4722,4723,4724,4725,4726,4727,4728,4729,4730,4731,
4732,4733,4734,4735,1631,4736,1632,4737,4738,4739,4740,4741,4742,4743,4744,1633,
4745,4746,4747,4748,4749,1262,4750,4751,4752,4753,4754,1363,4755,4756,4757,4758,
4759,4760,4761,4762,4763,4764,4765,4766,4767,4768,1634,4769,4770,4771,4772,4773,
4774,4775,4776,4777,4778,1635,4779,4780,4781,4782,4783,4784,4785,4786,4787,4788,
4789,1636,4790,4791,4792,4793,4794,4795,4796,4797,4798,4799,4800,4801,4802,4803,
4804,4805,4806,1637,4807,4808,4809,1638,4810,4811,4812,4813,4814,4815,4816,4817,
4818,1639,4819,4820,4821,4822,4823,4824,4825,4826,4827,4828,4829,4830,4831,4832,
4833,1077,4834,4835,4836,4837,4838,4839,4840,4841,4842,4843,4844,4845,4846,4847,
4848,4849,4850,4851,4852,4853,4854,4855,4856,4857,4858,4859,4860,4861,4862,4863,
4864,4865,4866,4867,4868,4869,4870,4871,4872,4873,4874,4875,4876,4877,4878,4879,
4880,4881,4882,4883,1640,4884,4885,1641,4886,4887,4888,4889,4890,4891,4892,4893,
4894,4895,4896,4897,4898,4899,4900,4901,4902,4903,4904,4905,4906,4907,4908,4909,
4910,4911,1642,4912,4913,4914,1364,4915,4916,4917,4918,4919,4920,4921,4922,4923,
4924,4925,4926,4927,4928,4929,4930,4931,1643,4932,4933,4934,4935,4936,4937,4938,
4939,4940,4941,4942,4943,4944,4945,4946,4947,4948,4949,4950,4951,4952,4953,4954,
4955,4956,4957,4958,4959,4960,4961,4962,4963,4964,4965,4966,4967,4968,4969,4970,
4971,4972,4973,4974,4975,4976,4977,4978,4979,4980,1644,4981,4982,4983,4984,1645,
4985,4986,1646,4987,4988,4989,4990,4991,4992,4993,4994,4995,4996,4997,4998,4999,
5000,5001,5002,5003,5004,5005,1647,5006,1648,5007,5008,5009,5010,5011,5012,1078,
5013,5014,5015,5016,5017,5018,5019,5020,5021,5022,5023,5024,5025,5026,5027,5028,
1365,5029,5030,5031,5032,5033,5034,5035,5036,5037,5038,5039,1649,5040,5041,5042,
5043,5044,5045,1366,5046,5047,5048,5049,5050,5051,5052,5053,5054,5055,1650,5056,
5057,5058,5059,5060,5061,5062,5063,5064,5065,5066,5067,5068,5069,5070,5071,5072,
5073,5074,5075,5076,5077,1651,5078,5079,5080,5081,5082,5083,5084,5085,5086,5087,
5088,5089,5090,5091,5092,5093,5094,5095,5096,5097,5098,5099,5100,5101,5102,5103,
5104,5105,5106,5107,5108,5109,5110,1652,5111,5112,5113,5114,5115,5116,5117,5118,
1367,5119,5120,5121,5122,5123,5124,5125,5126,5127,5128,5129,1653,5130,5131,5132,
5133,5134,5135,5136,5137,5138,5139,5140,5141,5142,5143,5144,5145,5146,5147,5148,
5149,1368,5150,1654,5151,1369,5152,5153,5154,5155,5156,5157,5158,5159,5160,5161,
5162,5163,5164,5165,5166,5167,5168,5169,5170,5171,5172,5173,5174,5175,5176,5177,
5178,1370,5179,5180,5181,5182,5183,5184,5185,5186,5187,5188,5189,5190,5191,5192,
5193,5194,5195,5196,5197,5198,1655,5199,5200,5201,5202,1656,5203,5204,5205,5206,
1371,5207,1372,5208,5209,5210,5211,1373,5212,5213,1374,5214,5215,5216,5217,5218,
5219,5220,5221,5222,5223,5224,5225,5226,5227,5228,5229,5230,5231,5232,5233,5234,
5235,5236,5237,5238,5239,5240,5241,5242,5243,5244,5245,5246,5247,1657,5248,5249,
5250,5251,1658,1263,5252,5253,5254,5255,5256,1375,5257,5258,5259,5260,5261,5262,
5263,5264,5265,5266,5267,5268,5269,5270,5271,5272,5273,5274,5275,5276,5277,5278,
5279,5280,5281,5282,5283,1659,5284,5285,5286,5287,5288,5289,5290,5291,5292,5293,
5294,5295,5296,5297,5298,5299,5300,1660,5301,5302,5303,5304,5305,5306,5307,5308,
5309,5310,5311,5312,5313,5314,5315,5316,5317,5318,5319,5320,5321,1376,5322,5323,
5324,5325,5326,5327,5328,5329,5330,5331,5332,5333,1198,5334,5335,5336,5337,5338,
5339,5340,5341,5342,5343,1661,5344,5345,5346,5347,5348,5349,5350,5351,5352,5353,
5354,5355,5356,5357,5358,5359,5360,5361,5362,5363,5364,5365,5366,5367,5368,5369,
5370,5371,5372,5373,5374,5375,5376,5377,5378,5379,5380,5381,5382,5383,5384,5385,
5386,5387,5388,5389,5390,5391,5392,5393,5394,5395,5396,5397,5398,1264,5399,5400,
5401,5402,5403,5404,5405,5406,5407,5408,5409,5410,5411,5412,1662,5413,5414,5415,
5416,1663,5417,5418,5419,5420,5421,5422,5423,5424,5425,5426,5427,5428,5429,5430,
5431,5432,5433,5434,5435,5436,5437,5438,1664,5439,5440,5441,5442,5443,5444,5445,
5446,5447,5448,5449,5450,5451,5452,5453,5454,5455,5456,5457,5458,5459,5460,5461,
5462,5463,5464,5465,5466,5467,5468,5469,5470,5471,5472,5473,5474,5475,5476,5477,
5478,1154,5479,5480,5481,5482,5483,5484,5485,1665,5486,5487,5488,5489,5490,5491,
5492,5493,5494,5495,5496,5497,5498,5499,5500,5501,5502,5503,5504,5505,5506,5507,
5508,5509,5510,5511,5512,5513,5514,5515,5516,5517,5518,5519,5520,5521,5522,5523,
5524,5525,5526,5527,5528,5529,5530,5531,5532,5533,5534,5535,5536,5537,5538,5539,
5540,5541,5542,5543,5544,5545,5546,5547,5548,1377,5549,5550,5551,5552,5553,5554,
5555,5556,5557,5558,5559,5560,5561,5562,5563,5564,5565,5566,5567,5568,5569,5570,
1114,5571,5572,5573,5574,5575,5576,5577,5578,5579,5580,5581,5582,5583,5584,5585,
5586,5587,5588,5589,5590,5591,5592,1378,5593,5594,5595,5596,5597,5598,5599,5600,
5601,5602,5603,5604,5605,5606,5607,5608,5609,5610,5611,5612,5613,5614,1379,5615,
5616,5617,5618,5619,5620,5621,5622,5623,5624,5625,5626,5627,5628,5629,5630,5631,
5632,5633,5634,1380,5635,5636,5637,5638,5639,5640,5641,5642,5643,5644,5645,5646,
5647,5648,5649,1381,1056,5650,5651,5652,5653,5654,5655,5656,5657,5658,5659,5660,
1666,5661,5662,5663,5664,5665,5666,5667,5668,1667,5669,1668,5670,5671,5672,5673,
5674,5675,5676,5677,5678,1155,5679,5680,5681,5682,5683,5684,5685,5686,5687,5688,
5689,5690,5691,5692,5693,5694,5695,5696,5697,5698,1669,5699,5700,5701,5702,5703,
5704,5705,1670,5706,5707,5708,5709,5710,1671,5711,5712,5713,5714,1382,5715,5716,
5717,5718,5719,5720,5721,5722,5723,5724,5725,1672,5726,5727,1673,1674,5728,5729,
5730,5731,5732,5733,5734,5735,5736,1675,5737,5738,5739,5740,5741,5742,5743,5744,
1676,5745,5746,5747,5748,5749,5750,5751,1383,5752,5753,5754,5755,5756,5757,5758,
5759,5760,5761,5762,5763,5764,5765,5766,5767,5768,1677,5769,5770,5771,5772,5773,
1678,5774,5775,5776, 998,5777,5778,5779,5780,5781,5782,5783,5784,5785,1384,5786,
5787,5788,5789,5790,5791,5792,5793,5794,5795,5796,5797,5798,5799,5800,1679,5801,
5802,5803,1115,1116,5804,5805,5806,5807,5808,5809,5810,5811,5812,5813,5814,5815,
5816,5817,5818,5819,5820,5821,5822,5823,5824,5825,5826,5827,5828,5829,5830,5831,
5832,5833,5834,5835,5836,5837,5838,5839,5840,5841,5842,5843,5844,5845,5846,5847,
5848,5849,5850,5851,5852,5853,5854,5855,1680,5856,5857,5858,5859,5860,5861,5862,
5863,5864,1681,5865,5866,5867,1682,5868,5869,5870,5871,5872,5873,5874,5875,5876,
5877,5878,5879,1683,5880,1684,5881,5882,5883,5884,1685,5885,5886,5887,5888,5889,
5890,5891,5892,5893,5894,5895,5896,5897,5898,5899,5900,5901,5902,5903,5904,5905,
5906,5907,1686,5908,5909,5910,5911,5912,5913,5914,5915,5916,5917,5918,5919,5920,
5921,5922,5923,5924,5925,5926,5927,5928,5929,5930,5931,5932,5933,5934,5935,1687,
5936,5937,5938,5939,5940,5941,5942,5943,5944,5945,5946,5947,5948,5949,5950,5951,
5952,1688,1689,5953,1199,5954,5955,5956,5957,5958,5959,5960,5961,1690,5962,5963,
5964,5965,5966,5967,5968,5969,5970,5971,5972,5973,5974,5975,5976,5977,5978,5979,
5980,5981,1385,5982,1386,5983,5984,5985,5986,5987,5988,5989,5990,5991,5992,5993,
5994,5995,5996,5997,5998,5999,6000,6001,6002,6003,6004,6005,6006,6007,6008,6009,
6010,6011,6012,6013,6014,6015,6016,6017,6018,6019,6020,6021,6022,6023,6024,6025,
6026,6027,1265,6028,6029,1691,6030,6031,6032,6033,6034,6035,6036,6037,6038,6039,
6040,6041,6042,6043,6044,6045,6046,6047,6048,6049,6050,6051,6052,6053,6054,6055,
6056,6057,6058,6059,6060,6061,6062,6063,6064,6065,6066,6067,6068,6069,6070,6071,
6072,6073,6074,6075,6076,6077,6078,6079,6080,6081,6082,6083,6084,1692,6085,6086,
6087,6088,6089,6090,6091,6092,6093,6094,6095,6096,6097,6098,6099,6100,6101,6102,
6103,6104,6105,6106,6107,6108,6109,6110,6111,6112,6113,6114,6115,6116,6117,6118,
6119,6120,6121,6122,6123,6124,6125,6126,6127,6128,6129,6130,6131,1693,6132,6133,
6134,6135,6136,1694,6137,6138,6139,6140,6141,1695,6142,6143,6144,6145,6146,6147,
6148,6149,6150,6151,6152,6153,6154,6155,6156,6157,6158,6159,6160,6161,6162,6163,
6164,6165,6166,6167,6168,6169,6170,6171,6172,6173,6174,6175,6176,6177,6178,6179,
6180,6181,6182,6183,6184,6185,1696,6186,6187,6188,6189,6190,6191,6192,6193,6194,
6195,6196,6197,6198,6199,6200,6201,6202,6203,6204,6205,6206,6207,6208,6209,6210,
6211,6212,6213,6214,6215,6216,6217,6218,6219,1697,6220,6221,6222,6223,6224,6225,
6226,6227,6228,6229,6230,6231,6232,6233,6234,6235,6236,6237,6238,6239,6240,6241,
6242,6243,6244,6245,6246,6247,6248,6249,6250,6251,6252,6253,1698,6254,6255,6256,
6257,6258,6259,6260,6261,6262,6263,1200,6264,6265,6266,6267,6268,6269,6270,6271,  //1024
6272,6273,6274,6275,6276,6277,6278,6279,6280,6281,6282,6283,6284,6285,6286,6287,
6288,6289,6290,6291,6292,6293,6294,6295,6296,6297,6298,6299,6300,6301,6302,1699,
6303,6304,1700,6305,6306,6307,6308,6309,6310,6311,6312,6313,6314,6315,6316,6317,
6318,6319,6320,6321,6322,6323,6324,6325,6326,6327,6328,6329,6330,6331,6332,6333,
6334,6335,6336,6337,6338,6339,1701,6340,6341,6342,6343,6344,1387,6345,6346,6347,
6348,6349,6350,6351,6352,6353,6354,6355,6356,6357,6358,6359,6360,6361,6362,6363,
6364,6365,6366,6367,6368,6369,6370,6371,6372,6373,6374,6375,6376,6377,6378,6379,
6380,6381,6382,6383,6384,6385,6386,6387,6388,6389,6390,6391,6392,6393,6394,6395,
6396,6397,6398,6399,6400,6401,6402,6403,6404,6405,6406,6407,6408,6409,6410,6411,
6412,6413,1702,6414,6415,6416,6417,6418,6419,6420,6421,6422,1703,6423,6424,6425,
6426,6427,6428,6429,6430,6431,6432,6433,6434,6435,6436,6437,6438,1704,6439,6440,
6441,6442,6443,6444,6445,6446,6447,6448,6449,6450,6451,6452,6453,6454,6455,6456,
6457,6458,6459,6460,6461,6462,6463,6464,6465,6466,6467,6468,6469,6470,6471,6472,
6473,6474,6475,6476,6477,6478,6479,6480,6481,6482,6483,6484,6485,6486,6487,6488,
6489,6490,6491,6492,6493,6494,6495,6496,6497,6498,6499,6500,6501,6502,6503,1266,
6504,6505,6506,6507,6508,6509,6510,6511,6512,6513,6514,6515,6516,6517,6518,6519,
6520,6521,6522,6523,6524,6525,6526,6527,6528,6529,6530,6531,6532,6533,6534,6535,
6536,6537,6538,6539,6540,6541,6542,6543,6544,6545,6546,6547,6548,6549,6550,6551,
1705,1706,6552,6553,6554,6555,6556,6557,6558,6559,6560,6561,6562,6563,6564,6565,
6566,6567,6568,6569,6570,6571,6572,6573,6574,6575,6576,6577,6578,6579,6580,6581,
6582,6583,6584,6585,6586,6587,6588,6589,6590,6591,6592,6593,6594,6595,6596,6597,
6598,6599,6600,6601,6602,6603,6604,6605,6606,6607,6608,6609,6610,6611,6612,6613,
6614,6615,6616,6617,6618,6619,6620,6621,6622,6623,6624,6625,6626,6627,6628,6629,
6630,6631,6632,6633,6634,6635,6636,6637,1388,6638,6639,6640,6641,6642,6643,6644,
1707,6645,6646,6647,6648,6649,6650,6651,6652,6653,6654,6655,6656,6657,6658,6659,
6660,6661,6662,6663,1708,6664,6665,6666,6667,6668,6669,6670,6671,6672,6673,6674,
1201,6675,6676,6677,6678,6679,6680,6681,6682,6683,6684,6685,6686,6687,6688,6689,
6690,6691,6692,6693,6694,6695,6696,6697,6698,6699,6700,6701,6702,6703,6704,6705,
6706,6707,6708,6709,6710,6711,6712,6713,6714,6715,6716,6717,6718,6719,6720,6721,
6722,6723,6724,6725,1389,6726,6727,6728,6729,6730,6731,6732,6733,6734,6735,6736,
1390,1709,6737,6738,6739,6740,6741,6742,1710,6743,6744,6745,6746,1391,6747,6748,
6749,6750,6751,6752,6753,6754,6755,6756,6757,1392,6758,6759,6760,6761,6762,6763,
6764,6765,6766,6767,6768,6769,6770,6771,6772,6773,6774,6775,6776,6777,6778,6779,
6780,1202,6781,6782,6783,6784,6785,6786,6787,6788,6789,6790,6791,6792,6793,6794,
6795,6796,6797,6798,6799,6800,6801,6802,6803,6804,6805,6806,6807,6808,6809,1711,
6810,6811,6812,6813,6814,6815,6816,6817,6818,6819,6820,6821,6822,6823,6824,6825,
6826,6827,6828,6829,6830,6831,6832,6833,6834,6835,6836,1393,6837,6838,6839,6840,
6841,6842,6843,6844,6845,6846,6847,6848,6849,6850,6851,6852,6853,6854,6855,6856,
6857,6858,6859,6860,6861,6862,6863,6864,6865,6866,6867,6868,6869,6870,6871,6872,
6873,6874,6875,6876,6877,6878,6879,6880,6881,6882,6883,6884,6885,6886,6887,6888,
6889,6890,6891,6892,6893,6894,6895,6896,6897,6898,6899,6900,6901,6902,1712,6903,
6904,6905,6906,6907,6908,6909,6910,1713,6911,6912,6913,6914,6915,6916,6917,6918,
6919,6920,6921,6922,6923,6924,6925,6926,6927,6928,6929,6930,6931,6932,6933,6934,
6935,6936,6937,6938,6939,6940,6941,6942,6943,6944,6945,6946,6947,6948,6949,6950,
6951,6952,6953,6954,6955,6956,6957,6958,6959,6960,6961,6962,6963,6964,6965,6966,
6967,6968,6969,6970,6971,6972,6973,6974,1714,6975,6976,6977,6978,6979,6980,6981,
6982,6983,6984,6985,6986,6987,6988,1394,6989,6990,6991,6992,6993,6994,6995,6996,
6997,6998,6999,7000,1715,7001,7002,7003,7004,7005,7006,7007,7008,7009,7010,7011,
7012,7013,7014,7015,7016,7017,7018,7019,7020,7021,7022,7023,7024,7025,7026,7027,
7028,1716,7029,7030,7031,7032,7033,7034,7035,7036,7037,7038,7039,7040,7041,7042,
7043,7044,7045,7046,7047,7048,7049,7050,7051,7052,7053,7054,7055,7056,7057,7058,
7059,7060,7061,7062,7063,7064,7065,7066,7067,7068,7069,7070,7071,7072,7073,7074,
7075,7076,7077,7078,7079,7080,7081,7082,7083,7084,7085,7086,7087,7088,7089,7090,
7091,7092,7093,7094,7095,7096,7097,7098,7099,7100,7101,7102,7103,7104,7105,7106,
7107,7108,7109,7110,7111,7112,7113,7114,7115,7116,7117,7118,7119,7120,7121,7122,
7123,7124,7125,7126,7127,7128,7129,7130,7131,7132,7133,7134,7135,7136,7137,7138,
7139,7140,7141,7142,7143,7144,7145,7146,7147,7148,7149,7150,7151,7152,7153,7154,
7155,7156,7157,7158,7159,7160,7161,7162,7163,7164,7165,7166,7167,7168,7169,7170,
7171,7172,7173,7174,7175,7176,7177,7178,7179,7180,7181,7182,7183,7184,7185,7186,
7187,7188,7189,7190,7191,7192,7193,7194,7195,7196,7197,7198,7199,7200,7201,7202,
7203,7204,7205,7206,7207,1395,7208,7209,7210,7211,7212,7213,1717,7214,7215,7216,
7217,7218,7219,7220,7221,7222,7223,7224,7225,7226,7227,7228,7229,7230,7231,7232,
7233,7234,7235,7236,7237,7238,7239,7240,7241,7242,7243,7244,7245,7246,7247,7248,
7249,7250,7251,7252,7253,7254,7255,7256,7257,7258,7259,7260,7261,7262,7263,7264,
7265,7266,7267,7268,7269,7270,7271,7272,7273,7274,7275,7276,7277,7278,7279,7280,
7281,7282,7283,7284,7285,7286,7287,7288,7289,7290,7291,7292,7293,7294,7295,7296,
7297,7298,7299,7300,7301,7302,7303,7304,7305,7306,7307,7308,7309,7310,7311,7312,
7313,1718,7314,7315,7316,7317,7318,7319,7320,7321,7322,7323,7324,7325,7326,7327,
7328,7329,7330,7331,7332,7333,7334,7335,7336,7337,7338,7339,7340,7341,7342,7343,
7344,7345,7346,7347,7348,7349,7350,7351,7352,7353,7354,7355,7356,7357,7358,7359,
7360,7361,7362,7363,7364,7365,7366,7367,7368,7369,7370,7371,7372,7373,7374,7375,
7376,7377,7378,7379,7380,7381,7382,7383,7384,7385,7386,7387,7388,7389,7390,7391,
7392,7393,7394,7395,7396,7397,7398,7399,7400,7401,7402,7403,7404,7405,7406,7407,
7408,7409,7410,7411,7412,7413,7414,7415,7416,7417,7418,7419,7420,7421,7422,7423,
7424,7425,7426,7427,7428,7429,7430,7431,7432,7433,7434,7435,7436,7437,7438,7439,
7440,7441,7442,7443,7444,7445,7446,7447,7448,7449,7450,7451,7452,7453,7454,7455,
7456,7457,7458,7459,7460,7461,7462,7463,7464,7465,7466,7467,7468,7469,7470,7471,
7472,7473,7474,7475,7476,7477,7478,7479,7480,7481,7482,7483,7484,7485,7486,7487,
7488,7489,7490,7491,7492,7493,7494,7495,7496,7497,7498,7499,7500,7501,7502,7503,
7504,7505,7506,7507,7508,7509,7510,7511,7512,7513,7514,7515,7516,7517,7518,7519,
7520,7521,7522,7523,7524,7525,7526,7527,7528,7529,7530,7531,7532,7533,7534,7535,
7536,7537,7538,7539,7540,7541,7542,7543,7544,7545,7546,7547,7548,7549,7550,7551,
7552,7553,7554,7555,7556,7557,7558,7559,7560,7561,7562,7563,7564,7565,7566,7567,
7568,7569,7570,7571,7572,7573,7574,7575,7576,7577,7578,7579,7580,7581,7582,7583,
7584,7585,7586,7587,7588,7589,7590,7591,7592,7593,7594,7595,7596,7597,7598,7599,
7600,7601,7602,7603,7604,7605,7606,7607,7608,7609,7610,7611,7612,7613,7614,7615,
7616,7617,7618,7619,7620,7621,7622,7623,7624,7625,7626,7627,7628,7629,7630,7631,
7632,7633,7634,7635,7636,7637,7638,7639,7640,7641,7642,7643,7644,7645,7646,7647,
7648,7649,7650,7651,7652,7653,7654,7655,7656,7657,7658,7659,7660,7661,7662,7663,
7664,7665,7666,7667,7668,7669,7670,7671,7672,7673,7674,7675,7676,7677,7678,7679,
7680,7681,7682,7683,7684,7685,7686,7687,7688,7689,7690,7691,7692,7693,7694,7695,
7696,7697,7698,7699,7700,7701,7702,7703,7704,7705,7706,7707,7708,7709,7710,7711,
7712,7713,7714,7715,7716,7717,7718,7719,7720,7721,7722,7723,7724,7725,7726,7727,
7728,7729,7730,7731,7732,7733,7734,7735,7736,7737,7738,7739,7740,7741,7742,7743,
7744,7745,7746,7747,7748,7749,7750,7751,7752,7753,7754,7755,7756,7757,7758,7759,
7760,7761,7762,7763,7764,7765,7766,7767,7768,7769,7770,7771,7772,7773,7774,7775,
7776,7777,7778,7779,7780,7781,7782,7783,7784,7785,7786,7787,7788,7789,7790,7791,
7792,7793,7794,7795,7796,7797,7798,7799,7800,7801,7802,7803,7804,7805,7806,7807,
7808,7809,7810,7811,7812,7813,7814,7815,7816,7817,7818,7819,7820,7821,7822,7823,
7824,7825,7826,7827,7828,7829,7830,7831,7832,7833,7834,7835,7836,7837,7838,7839,
7840,7841,7842,7843,7844,7845,7846,7847,7848,7849,7850,7851,7852,7853,7854,7855,
7856,7857,7858,7859,7860,7861,7862,7863,7864,7865,7866,7867,7868,7869,7870,7871,
7872,7873,7874,7875,7876,7877,7878,7879,7880,7881,7882,7883,7884,7885,7886,7887,
7888,7889,7890,7891,7892,7893,7894,7895,7896,7897,7898,7899,7900,7901,7902,7903,
7904,7905,7906,7907,7908,7909,7910,7911,7912,7913,7914,7915,7916,7917,7918,7919,
7920,7921,7922,7923,7924,7925,7926,7927,7928,7929,7930,7931,7932,7933,7934,7935,
7936,7937,7938,7939,7940,7941,7942,7943,7944,7945,7946,7947,7948,7949,7950,7951,
7952,7953,7954,7955,7956,7957,7958,7959,7960,7961,7962,7963,7964,7965,7966,7967,
7968,7969,7970,7971,7972,7973,7974,7975,7976,7977,7978,7979,7980,7981,7982,7983,
7984,7985,7986,7987,7988,7989,7990,7991,7992,7993,7994,7995,7996,7997,7998,7999,
8000,8001,8002,8003,8004,8005,8006,8007,8008,8009,8010,8011,8012,8013,8014,8015,
8016,8017,8018,8019,8020,8021,8022,8023,8024,8025,8026,8027,8028,8029,8030,8031,
8032,8033,8034,8035,8036,8037,8038,8039,8040,8041,8042,8043,8044,8045,8046,8047,
8048,8049,8050,8051,8052,8053,8054,8055,8056,8057,8058,8059,8060,8061,8062,8063,
8064,8065,8066,8067,8068,8069,8070,8071,8072,8073,8074,8075,8076,8077,8078,8079,
8080,8081,8082,8083,8084,8085,8086,8087,8088,8089,8090,8091,8092,8093,8094,8095,
8096,8097,8098,8099,8100,8101,8102,8103,8104,8105,8106,8107,8108,8109,8110,8111,
8112,8113,8114,8115,8116,8117,8118,8119,8120,8121,8122,8123,8124,8125,8126,8127,
8128,8129,8130,8131,8132,8133,8134,8135,8136,8137,8138,8139,8140,8141,8142,8143,
8144,8145,8146,8147,8148,8149,8150,8151,8152,8153,8154,8155,8156,8157,8158,8159,
8160,8161,8162,8163,8164,8165,8166,8167,8168,8169,8170,8171,8172,8173,8174,8175,
8176,8177,8178,8179,8180,8181,8182,8183,8184,8185,8186,8187,8188,8189,8190,8191,
8192,8193,8194,8195,8196,8197,8198,8199,8200,8201,8202,8203,8204,8205,8206,8207,
8208,8209,8210,8211,8212,8213,8214,8215,8216,8217,8218,8219,8220,8221,8222,8223,
8224,8225,8226,8227,8228,8229,8230,8231,8232,8233,8234,8235,8236,8237,8238,8239,
8240,8241,8242,8243,8244,8245,8246,8247,8248,8249,8250,8251,8252,8253,8254,8255,
8256,8257,8258,8259,8260,8261,8262,8263,8264,8265,8266,8267,8268,8269,8270,8271,
8272,8273,8274,8275,8276,8277,8278,8279,8280,8281,8282,8283,8284,8285,8286,8287,
8288,8289,8290,8291,8292,8293,8294,8295,8296,8297,8298,8299,8300,8301,8302,8303,
8304,8305,8306,8307,8308,8309,8310,8311,8312,8313,8314,8315,8316,8317,8318,8319,
8320,8321,8322,8323,8324,8325,8326,8327,8328,8329,8330,8331,8332,8333,8334,8335,
8336,8337,8338,8339,8340,8341,8342,8343,8344,8345,8346,8347,8348,8349,8350,8351,
8352,8353,8354,8355,8356,8357,8358,8359,8360,8361,8362,8363,8364,8365,8366,8367,
8368,8369,8370,8371,8372,8373,8374,8375,8376,8377,8378,8379,8380,8381,8382,8383,
8384,8385,8386,8387,8388,8389,8390,8391,8392,8393,8394,8395,8396,8397,8398,8399,
8400,8401,8402,8403,8404,8405,8406,8407,8408,8409,8410,8411,8412,8413,8414,8415,
8416,8417,8418,8419,8420,8421,8422,8423,8424,8425,8426,8427,8428,8429,8430,8431,
8432,8433,8434,8435,8436,8437,8438,8439,8440,8441,8442,8443,8444,8445,8446,8447,
8448,8449,8450,8451,8452,8453,8454,8455,8456,8457,8458,8459,8460,8461,8462,8463,
8464,8465,8466,8467,8468,8469,8470,8471,8472,8473,8474,8475,8476,8477,8478,8479,
8480,8481,8482,8483,8484,8485,8486,8487,8488,8489,8490,8491,8492,8493,8494,8495,
8496,8497,8498,8499,8500,8501,8502,8503,8504,8505,8506,8507,8508,8509,8510,8511,
8512,8513,8514,8515,8516,8517,8518,8519,8520,8521,8522,8523,8524,8525,8526,8527,
8528,8529,8530,8531,8532,8533,8534,8535,8536,8537,8538,8539,8540,8541,8542,8543,
8544,8545,8546,8547,8548,8549,8550,8551,8552,8553,8554,8555,8556,8557,8558,8559,
8560,8561,8562,8563,8564,8565,8566,8567,8568,8569,8570,8571,8572,8573,8574,8575,
8576,8577,8578,8579,8580,8581,8582,8583,8584,8585,8586,8587,8588,8589,8590,8591,
8592,8593,8594,8595,8596,8597,8598,8599,8600,8601,8602,8603,8604,8605,8606,8607,
8608,8609,8610,8611,8612,8613,8614,8615,8616,8617,8618,8619,8620,8621,8622,8623,
8624,8625,8626,8627,8628,8629,8630,8631,8632,8633,8634,8635,8636,8637,8638,8639,
8640,8641,8642,8643,8644,8645,8646,8647,8648,8649,8650,8651,8652,8653,8654,8655,
8656,8657,8658,8659,8660,8661,8662,8663,8664,8665,8666,8667,8668,8669,8670,8671,
8672,8673,8674,8675,8676,8677,8678,8679,8680,8681,8682,8683,8684,8685,8686,8687,
8688,8689,8690,8691,8692,8693,8694,8695,8696,8697,8698,8699,8700,8701,8702,8703,
8704,8705,8706,8707,8708,8709,8710,8711,8712,8713,8714,8715,8716,8717,8718,8719,
8720,8721,8722,8723,8724,8725,8726,8727,8728,8729,8730,8731,8732,8733,8734,8735,
8736,8737,8738,8739,8740,8741
];

/*
 * The Original Code is Mozilla Universal charset detector code.
 *
 * The Initial Developer of the Original Code is
 * Netscape Communications Corporation.
 * Portions created by the Initial Developer are Copyright (C) 2001
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   António Afonso (antonio.afonso gmail.com) - port to JavaScript
 *   Mark Pilgrim - port to Python
 *   Shy Shalom - original C code
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301  USA
 */

// Big5 frequency table
// by Taiwan's Mandarin Promotion Council
// <http://www.edu.tw:81/mandr/>
//
// 128  --> 0.42261
// 256  --> 0.57851
// 512  --> 0.74851
// 1024 --> 0.89384
// 2048 --> 0.97583
//
// Ideal Distribution Ratio = 0.74851/(1-0.74851) =2.98
// Random Distribution Ration = 512/(5401-512)=0.105
//
// Typical Distribution Ratio about 25% of Ideal one, still much higher than RDR

jschardet.BIG5_TYPICAL_DISTRIBUTION_RATIO = 0.75;

//Char to FreqOrder table
jschardet.BIG5_TABLE_SIZE = 5376;

jschardet.Big5CharToFreqOrder = [
   1,1801,1506, 255,1431, 198,   9,  82,   6,5008, 177, 202,3681,1256,2821, 110, //   16
3814,  33,3274, 261,  76,  44,2114,  16,2946,2187,1176, 659,3971,  26,3451,2653, //   32
1198,3972,3350,4202, 410,2215, 302, 590, 361,1964,   8, 204,  58,4510,5009,1932, //   48
  63,5010,5011, 317,1614,  75, 222, 159,4203,2417,1480,5012,3555,3091, 224,2822, //   64
3682,   3,  10,3973,1471,  29,2787,1135,2866,1940, 873, 130,3275,1123, 312,5013, //   80
4511,2052, 507, 252, 682,5014, 142,1915, 124, 206,2947,  34,3556,3204,  64, 604, //   96
5015,2501,1977,1978, 155,1991, 645, 641,1606,5016,3452, 337,  72, 406,5017,  80, //  112
 630, 238,3205,1509, 263, 939,1092,2654, 756,1440,1094,3453, 449,  69,2987, 591, //  128
 179,2096, 471, 115,2035,1844,  60,  50,2988, 134, 806,1869, 734,2036,3454, 180, //  144
 995,1607, 156, 537,2907, 688,5018, 319,1305, 779,2145, 514,2379, 298,4512, 359, //  160
2502,  90,2716,1338, 663,  11, 906,1099,2553,  20,2441, 182, 532,1716,5019, 732, //  176
1376,4204,1311,1420,3206,  25,2317,1056, 113, 399, 382,1950, 242,3455,2474, 529, //  192
3276, 475,1447,3683,5020, 117,  21, 656, 810,1297,2300,2334,3557,5021, 126,4205, //  208
 706, 456, 150, 613,4513,  71,1118,2037,4206, 145,3092,  85, 835, 486,2115,1246, //  224
1426, 428, 727,1285,1015, 800, 106, 623, 303,1281,5022,2128,2359, 347,3815, 221, //  240
3558,3135,5023,1956,1153,4207,  83, 296,1199,3093, 192, 624,  93,5024, 822,1898, //  256
2823,3136, 795,2065, 991,1554,1542,1592,  27,  43,2867, 859, 139,1456, 860,4514, //  272
 437, 712,3974, 164,2397,3137, 695, 211,3037,2097, 195,3975,1608,3559,3560,3684, //  288
3976, 234, 811,2989,2098,3977,2233,1441,3561,1615,2380, 668,2077,1638, 305, 228, //  304
1664,4515, 467, 415,5025, 262,2099,1593, 239, 108, 300, 200,1033, 512,1247,2078, //  320
5026,5027,2176,3207,3685,2682, 593, 845,1062,3277,  88,1723,2038,3978,1951, 212, //  336
 266, 152, 149, 468,1899,4208,4516,  77, 187,5028,3038,  37,   5,2990,5029,3979, //  352
5030,5031,  39,2524,4517,2908,3208,2079,  55, 148,  74,4518, 545, 483,1474,1029, //  368
1665, 217,1870,1531,3138,1104,2655,4209,  24, 172,3562, 900,3980,3563,3564,4519, //  384
  32,1408,2824,1312, 329, 487,2360,2251,2717, 784,2683,   4,3039,3351,1427,1789, //  400
 188, 109, 499,5032,3686,1717,1790, 888,1217,3040,4520,5033,3565,5034,3352,1520, //  416
3687,3981, 196,1034, 775,5035,5036, 929,1816, 249, 439,  38,5037,1063,5038, 794, //  432
3982,1435,2301,  46, 178,3278,2066,5039,2381,5040, 214,1709,4521, 804,  35, 707, //  448
 324,3688,1601,2554, 140, 459,4210,5041,5042,1365, 839, 272, 978,2262,2580,3456, //  464
2129,1363,3689,1423, 697, 100,3094,  48,  70,1231, 495,3139,2196,5043,1294,5044, //  480
2080, 462, 586,1042,3279, 853, 256, 988, 185,2382,3457,1698, 434,1084,5045,3458, //  496
 314,2625,2788,4522,2335,2336, 569,2285, 637,1817,2525, 757,1162,1879,1616,3459, //  512
 287,1577,2116, 768,4523,1671,2868,3566,2526,1321,3816, 909,2418,5046,4211, 933, //  528
3817,4212,2053,2361,1222,4524, 765,2419,1322, 786,4525,5047,1920,1462,1677,2909, //  544
1699,5048,4526,1424,2442,3140,3690,2600,3353,1775,1941,3460,3983,4213, 309,1369, //  560
1130,2825, 364,2234,1653,1299,3984,3567,3985,3986,2656, 525,1085,3041, 902,2001, //  576
1475, 964,4527, 421,1845,1415,1057,2286, 940,1364,3141, 376,4528,4529,1381,   7, //  592
2527, 983,2383, 336,1710,2684,1846, 321,3461, 559,1131,3042,2752,1809,1132,1313, //  608
 265,1481,1858,5049, 352,1203,2826,3280, 167,1089, 420,2827, 776, 792,1724,3568, //  624
4214,2443,3281,5050,4215,5051, 446, 229, 333,2753, 901,3818,1200,1557,4530,2657, //  640
1921, 395,2754,2685,3819,4216,1836, 125, 916,3209,2626,4531,5052,5053,3820,5054, //  656
5055,5056,4532,3142,3691,1133,2555,1757,3462,1510,2318,1409,3569,5057,2146, 438, //  672
2601,2910,2384,3354,1068, 958,3043, 461, 311,2869,2686,4217,1916,3210,4218,1979, //  688
 383, 750,2755,2627,4219, 274, 539, 385,1278,1442,5058,1154,1965, 384, 561, 210, //  704
  98,1295,2556,3570,5059,1711,2420,1482,3463,3987,2911,1257, 129,5060,3821, 642, //  720
 523,2789,2790,2658,5061, 141,2235,1333,  68, 176, 441, 876, 907,4220, 603,2602, //  736
 710, 171,3464, 404, 549,  18,3143,2398,1410,3692,1666,5062,3571,4533,2912,4534, //  752
5063,2991, 368,5064, 146, 366,  99, 871,3693,1543, 748, 807,1586,1185,  22,2263, //  768
 379,3822,3211,5065,3212, 505,1942,2628,1992,1382,2319,5066, 380,2362, 218, 702, //  784
1818,1248,3465,3044,3572,3355,3282,5067,2992,3694, 930,3283,3823,5068,  59,5069, //  800
 585, 601,4221, 497,3466,1112,1314,4535,1802,5070,1223,1472,2177,5071, 749,1837, //  816
 690,1900,3824,1773,3988,1476, 429,1043,1791,2236,2117, 917,4222, 447,1086,1629, //  832
5072, 556,5073,5074,2021,1654, 844,1090, 105, 550, 966,1758,2828,1008,1783, 686, //  848
1095,5075,2287, 793,1602,5076,3573,2603,4536,4223,2948,2302,4537,3825, 980,2503, //  864
 544, 353, 527,4538, 908,2687,2913,5077, 381,2629,1943,1348,5078,1341,1252, 560, //  880
3095,5079,3467,2870,5080,2054, 973, 886,2081, 143,4539,5081,5082, 157,3989, 496, //  896
4224,  57, 840, 540,2039,4540,4541,3468,2118,1445, 970,2264,1748,1966,2082,4225, //  912
3144,1234,1776,3284,2829,3695, 773,1206,2130,1066,2040,1326,3990,1738,1725,4226, //  928
 279,3145,  51,1544,2604, 423,1578,2131,2067, 173,4542,1880,5083,5084,1583, 264, //  944
 610,3696,4543,2444, 280, 154,5085,5086,5087,1739, 338,1282,3096, 693,2871,1411, //  960
1074,3826,2445,5088,4544,5089,5090,1240, 952,2399,5091,2914,1538,2688, 685,1483, //  976
4227,2475,1436, 953,4228,2055,4545, 671,2400,  79,4229,2446,3285, 608, 567,2689, //  992
3469,4230,4231,1691, 393,1261,1792,2401,5092,4546,5093,5094,5095,5096,1383,1672, // 1008
3827,3213,1464, 522,1119, 661,1150, 216, 675,4547,3991,1432,3574, 609,4548,2690, // 1024
2402,5097,5098,5099,4232,3045,   0,5100,2476, 315, 231,2447, 301,3356,4549,2385, // 1040
5101, 233,4233,3697,1819,4550,4551,5102,  96,1777,1315,2083,5103, 257,5104,1810, // 1056
3698,2718,1139,1820,4234,2022,1124,2164,2791,1778,2659,5105,3097, 363,1655,3214, // 1072
5106,2993,5107,5108,5109,3992,1567,3993, 718, 103,3215, 849,1443, 341,3357,2949, // 1088
1484,5110,1712, 127,  67, 339,4235,2403, 679,1412, 821,5111,5112, 834, 738, 351, // 1104
2994,2147, 846, 235,1497,1881, 418,1993,3828,2719, 186,1100,2148,2756,3575,1545, // 1120
1355,2950,2872,1377, 583,3994,4236,2581,2995,5113,1298,3699,1078,2557,3700,2363, // 1136
  78,3829,3830, 267,1289,2100,2002,1594,4237, 348, 369,1274,2197,2178,1838,4552, // 1152
1821,2830,3701,2757,2288,2003,4553,2951,2758, 144,3358, 882,4554,3995,2759,3470, // 1168
4555,2915,5114,4238,1726, 320,5115,3996,3046, 788,2996,5116,2831,1774,1327,2873, // 1184
3997,2832,5117,1306,4556,2004,1700,3831,3576,2364,2660, 787,2023, 506, 824,3702, // 1200
 534, 323,4557,1044,3359,2024,1901, 946,3471,5118,1779,1500,1678,5119,1882,4558, // 1216
 165, 243,4559,3703,2528, 123, 683,4239, 764,4560,  36,3998,1793, 589,2916, 816, // 1232
 626,1667,3047,2237,1639,1555,1622,3832,3999,5120,4000,2874,1370,1228,1933, 891, // 1248
2084,2917, 304,4240,5121, 292,2997,2720,3577, 691,2101,4241,1115,4561, 118, 662, // 1264
5122, 611,1156, 854,2386,1316,2875,   2, 386, 515,2918,5123,5124,3286, 868,2238, // 1280
1486, 855,2661, 785,2216,3048,5125,1040,3216,3578,5126,3146, 448,5127,1525,5128, // 1296
2165,4562,5129,3833,5130,4242,2833,3579,3147, 503, 818,4001,3148,1568, 814, 676, // 1312
1444, 306,1749,5131,3834,1416,1030, 197,1428, 805,2834,1501,4563,5132,5133,5134, // 1328
1994,5135,4564,5136,5137,2198,  13,2792,3704,2998,3149,1229,1917,5138,3835,2132, // 1344
5139,4243,4565,2404,3580,5140,2217,1511,1727,1120,5141,5142, 646,3836,2448, 307, // 1360
5143,5144,1595,3217,5145,5146,5147,3705,1113,1356,4002,1465,2529,2530,5148, 519, // 1376
5149, 128,2133,  92,2289,1980,5150,4003,1512, 342,3150,2199,5151,2793,2218,1981, // 1392
3360,4244, 290,1656,1317, 789, 827,2365,5152,3837,4566, 562, 581,4004,5153, 401, // 1408
4567,2252,  94,4568,5154,1399,2794,5155,1463,2025,4569,3218,1944,5156, 828,1105, // 1424
4245,1262,1394,5157,4246, 605,4570,5158,1784,2876,5159,2835, 819,2102, 578,2200, // 1440
2952,5160,1502, 436,3287,4247,3288,2836,4005,2919,3472,3473,5161,2721,2320,5162, // 1456
5163,2337,2068,  23,4571, 193, 826,3838,2103, 699,1630,4248,3098, 390,1794,1064, // 1472
3581,5164,1579,3099,3100,1400,5165,4249,1839,1640,2877,5166,4572,4573, 137,4250, // 1488
 598,3101,1967, 780, 104, 974,2953,5167, 278, 899, 253, 402, 572, 504, 493,1339, // 1504
5168,4006,1275,4574,2582,2558,5169,3706,3049,3102,2253, 565,1334,2722, 863,  41, // 1520
5170,5171,4575,5172,1657,2338,  19, 463,2760,4251, 606,5173,2999,3289,1087,2085, // 1536
1323,2662,3000,5174,1631,1623,1750,4252,2691,5175,2878, 791,2723,2663,2339, 232, // 1552
2421,5176,3001,1498,5177,2664,2630, 755,1366,3707,3290,3151,2026,1609, 119,1918, // 1568
3474, 862,1026,4253,5178,4007,3839,4576,4008,4577,2265,1952,2477,5179,1125, 817, // 1584
4254,4255,4009,1513,1766,2041,1487,4256,3050,3291,2837,3840,3152,5180,5181,1507, // 1600
5182,2692, 733,  40,1632,1106,2879, 345,4257, 841,2531, 230,4578,3002,1847,3292, // 1616
3475,5183,1263, 986,3476,5184, 735, 879, 254,1137, 857, 622,1300,1180,1388,1562, // 1632
4010,4011,2954, 967,2761,2665,1349, 592,2134,1692,3361,3003,1995,4258,1679,4012, // 1648
1902,2188,5185, 739,3708,2724,1296,1290,5186,4259,2201,2202,1922,1563,2605,2559, // 1664
1871,2762,3004,5187, 435,5188, 343,1108, 596,  17,1751,4579,2239,3477,3709,5189, // 1680
4580, 294,3582,2955,1693, 477, 979, 281,2042,3583, 643,2043,3710,2631,2795,2266, // 1696
1031,2340,2135,2303,3584,4581, 367,1249,2560,5190,3585,5191,4582,1283,3362,2005, // 1712
 240,1762,3363,4583,4584, 836,1069,3153, 474,5192,2149,2532, 268,3586,5193,3219, // 1728
1521,1284,5194,1658,1546,4260,5195,3587,3588,5196,4261,3364,2693,1685,4262, 961, // 1744
1673,2632, 190,2006,2203,3841,4585,4586,5197, 570,2504,3711,1490,5198,4587,2633, // 1760
3293,1957,4588, 584,1514, 396,1045,1945,5199,4589,1968,2449,5200,5201,4590,4013, // 1776
 619,5202,3154,3294, 215,2007,2796,2561,3220,4591,3221,4592, 763,4263,3842,4593, // 1792
5203,5204,1958,1767,2956,3365,3712,1174, 452,1477,4594,3366,3155,5205,2838,1253, // 1808
2387,2189,1091,2290,4264, 492,5206, 638,1169,1825,2136,1752,4014, 648, 926,1021, // 1824
1324,4595, 520,4596, 997, 847,1007, 892,4597,3843,2267,1872,3713,2405,1785,4598, // 1840
1953,2957,3103,3222,1728,4265,2044,3714,4599,2008,1701,3156,1551,  30,2268,4266, // 1856
5207,2027,4600,3589,5208, 501,5209,4267, 594,3478,2166,1822,3590,3479,3591,3223, // 1872
 829,2839,4268,5210,1680,3157,1225,4269,5211,3295,4601,4270,3158,2341,5212,4602, // 1888
4271,5213,4015,4016,5214,1848,2388,2606,3367,5215,4603, 374,4017, 652,4272,4273, // 1904
 375,1140, 798,5216,5217,5218,2366,4604,2269, 546,1659, 138,3051,2450,4605,5219, // 1920
2254, 612,1849, 910, 796,3844,1740,1371, 825,3845,3846,5220,2920,2562,5221, 692, // 1936
 444,3052,2634, 801,4606,4274,5222,1491, 244,1053,3053,4275,4276, 340,5223,4018, // 1952
1041,3005, 293,1168,  87,1357,5224,1539, 959,5225,2240, 721, 694,4277,3847, 219, // 1968
1478, 644,1417,3368,2666,1413,1401,1335,1389,4019,5226,5227,3006,2367,3159,1826, // 1984
 730,1515, 184,2840,  66,4607,5228,1660,2958, 246,3369, 378,1457, 226,3480, 975, // 2000
4020,2959,1264,3592, 674, 696,5229, 163,5230,1141,2422,2167, 713,3593,3370,4608, // 2016
4021,5231,5232,1186,  15,5233,1079,1070,5234,1522,3224,3594, 276,1050,2725, 758, // 2032
1126, 653,2960,3296,5235,2342, 889,3595,4022,3104,3007, 903,1250,4609,4023,3481, // 2048
3596,1342,1681,1718, 766,3297, 286,  89,2961,3715,5236,1713,5237,2607,3371,3008, // 2064
5238,2962,2219,3225,2880,5239,4610,2505,2533, 181, 387,1075,4024, 731,2190,3372, // 2080
5240,3298, 310, 313,3482,2304, 770,4278,  54,3054, 189,4611,3105,3848,4025,5241, // 2096
1230,1617,1850, 355,3597,4279,4612,3373, 111,4280,3716,1350,3160,3483,3055,4281, // 2112
2150,3299,3598,5242,2797,4026,4027,3009, 722,2009,5243,1071, 247,1207,2343,2478, // 2128
1378,4613,2010, 864,1437,1214,4614, 373,3849,1142,2220, 667,4615, 442,2763,2563, // 2144
3850,4028,1969,4282,3300,1840, 837, 170,1107, 934,1336,1883,5244,5245,2119,4283, // 2160
2841, 743,1569,5246,4616,4284, 582,2389,1418,3484,5247,1803,5248, 357,1395,1729, // 2176
3717,3301,2423,1564,2241,5249,3106,3851,1633,4617,1114,2086,4285,1532,5250, 482, // 2192
2451,4618,5251,5252,1492, 833,1466,5253,2726,3599,1641,2842,5254,1526,1272,3718, // 2208
4286,1686,1795, 416,2564,1903,1954,1804,5255,3852,2798,3853,1159,2321,5256,2881, // 2224
4619,1610,1584,3056,2424,2764, 443,3302,1163,3161,5257,5258,4029,5259,4287,2506, // 2240
3057,4620,4030,3162,2104,1647,3600,2011,1873,4288,5260,4289, 431,3485,5261, 250, // 2256
  97,  81,4290,5262,1648,1851,1558, 160, 848,5263, 866, 740,1694,5264,2204,2843, // 2272
3226,4291,4621,3719,1687, 950,2479, 426, 469,3227,3720,3721,4031,5265,5266,1188, // 2288
 424,1996, 861,3601,4292,3854,2205,2694, 168,1235,3602,4293,5267,2087,1674,4622, // 2304
3374,3303, 220,2565,1009,5268,3855, 670,3010, 332,1208, 717,5269,5270,3603,2452, // 2320
4032,3375,5271, 513,5272,1209,2882,3376,3163,4623,1080,5273,5274,5275,5276,2534, // 2336
3722,3604, 815,1587,4033,4034,5277,3605,3486,3856,1254,4624,1328,3058,1390,4035, // 2352
1741,4036,3857,4037,5278, 236,3858,2453,3304,5279,5280,3723,3859,1273,3860,4625, // 2368
5281, 308,5282,4626, 245,4627,1852,2480,1307,2583, 430, 715,2137,2454,5283, 270, // 2384
 199,2883,4038,5284,3606,2727,1753, 761,1754, 725,1661,1841,4628,3487,3724,5285, // 2400
5286, 587,  14,3305, 227,2608, 326, 480,2270, 943,2765,3607, 291, 650,1884,5287, // 2416
1702,1226, 102,1547,  62,3488, 904,4629,3489,1164,4294,5288,5289,1224,1548,2766, // 2432
 391, 498,1493,5290,1386,1419,5291,2056,1177,4630, 813, 880,1081,2368, 566,1145, // 2448
4631,2291,1001,1035,2566,2609,2242, 394,1286,5292,5293,2069,5294,  86,1494,1730, // 2464
4039, 491,1588, 745, 897,2963, 843,3377,4040,2767,2884,3306,1768, 998,2221,2070, // 2480
 397,1827,1195,1970,3725,3011,3378, 284,5295,3861,2507,2138,2120,1904,5296,4041, // 2496
2151,4042,4295,1036,3490,1905, 114,2567,4296, 209,1527,5297,5298,2964,2844,2635, // 2512
2390,2728,3164, 812,2568,5299,3307,5300,1559, 737,1885,3726,1210, 885,  28,2695, // 2528
3608,3862,5301,4297,1004,1780,4632,5302, 346,1982,2222,2696,4633,3863,1742, 797, // 2544
1642,4043,1934,1072,1384,2152, 896,4044,3308,3727,3228,2885,3609,5303,2569,1959, // 2560
4634,2455,1786,5304,5305,5306,4045,4298,1005,1308,3728,4299,2729,4635,4636,1528, // 2576
2610, 161,1178,4300,1983, 987,4637,1101,4301, 631,4046,1157,3229,2425,1343,1241, // 2592
1016,2243,2570, 372, 877,2344,2508,1160, 555,1935, 911,4047,5307, 466,1170, 169, // 2608
1051,2921,2697,3729,2481,3012,1182,2012,2571,1251,2636,5308, 992,2345,3491,1540, // 2624
2730,1201,2071,2406,1997,2482,5309,4638, 528,1923,2191,1503,1874,1570,2369,3379, // 2640
3309,5310, 557,1073,5311,1828,3492,2088,2271,3165,3059,3107, 767,3108,2799,4639, // 2656
1006,4302,4640,2346,1267,2179,3730,3230, 778,4048,3231,2731,1597,2667,5312,4641, // 2672
5313,3493,5314,5315,5316,3310,2698,1433,3311, 131,  95,1504,4049, 723,4303,3166, // 2688
1842,3610,2768,2192,4050,2028,2105,3731,5317,3013,4051,1218,5318,3380,3232,4052, // 2704
4304,2584, 248,1634,3864, 912,5319,2845,3732,3060,3865, 654,  53,5320,3014,5321, // 2720
1688,4642, 777,3494,1032,4053,1425,5322, 191, 820,2121,2846, 971,4643, 931,3233, // 2736
 135, 664, 783,3866,1998, 772,2922,1936,4054,3867,4644,2923,3234, 282,2732, 640, // 2752
1372,3495,1127, 922, 325,3381,5323,5324, 711,2045,5325,5326,4055,2223,2800,1937, // 2768
4056,3382,2224,2255,3868,2305,5327,4645,3869,1258,3312,4057,3235,2139,2965,4058, // 2784
4059,5328,2225, 258,3236,4646, 101,1227,5329,3313,1755,5330,1391,3314,5331,2924, // 2800
2057, 893,5332,5333,5334,1402,4305,2347,5335,5336,3237,3611,5337,5338, 878,1325, // 2816
1781,2801,4647, 259,1385,2585, 744,1183,2272,4648,5339,4060,2509,5340, 684,1024, // 2832
4306,5341, 472,3612,3496,1165,3315,4061,4062, 322,2153, 881, 455,1695,1152,1340, // 2848
 660, 554,2154,4649,1058,4650,4307, 830,1065,3383,4063,4651,1924,5342,1703,1919, // 2864
5343, 932,2273, 122,5344,4652, 947, 677,5345,3870,2637, 297,1906,1925,2274,4653, // 2880
2322,3316,5346,5347,4308,5348,4309,  84,4310, 112, 989,5349, 547,1059,4064, 701, // 2896
3613,1019,5350,4311,5351,3497, 942, 639, 457,2306,2456, 993,2966, 407, 851, 494, // 2912
4654,3384, 927,5352,1237,5353,2426,3385, 573,4312, 680, 921,2925,1279,1875, 285, // 2928
 790,1448,1984, 719,2168,5354,5355,4655,4065,4066,1649,5356,1541, 563,5357,1077, // 2944
5358,3386,3061,3498, 511,3015,4067,4068,3733,4069,1268,2572,3387,3238,4656,4657, // 2960
5359, 535,1048,1276,1189,2926,2029,3167,1438,1373,2847,2967,1134,2013,5360,4313, // 2976
1238,2586,3109,1259,5361, 700,5362,2968,3168,3734,4314,5363,4315,1146,1876,1907, // 2992
4658,2611,4070, 781,2427, 132,1589, 203, 147, 273,2802,2407, 898,1787,2155,4071, // 3008
4072,5364,3871,2803,5365,5366,4659,4660,5367,3239,5368,1635,3872, 965,5369,1805, // 3024
2699,1516,3614,1121,1082,1329,3317,4073,1449,3873,  65,1128,2848,2927,2769,1590, // 3040
3874,5370,5371,  12,2668,  45, 976,2587,3169,4661, 517,2535,1013,1037,3240,5372, // 3056
3875,2849,5373,3876,5374,3499,5375,2612, 614,1999,2323,3877,3110,2733,2638,5376, // 3072
2588,4316, 599,1269,5377,1811,3735,5378,2700,3111, 759,1060, 489,1806,3388,3318, // 3088
1358,5379,5380,2391,1387,1215,2639,2256, 490,5381,5382,4317,1759,2392,2348,5383, // 3104
4662,3878,1908,4074,2640,1807,3241,4663,3500,3319,2770,2349, 874,5384,5385,3501, // 3120
3736,1859,  91,2928,3737,3062,3879,4664,5386,3170,4075,2669,5387,3502,1202,1403, // 3136
3880,2969,2536,1517,2510,4665,3503,2511,5388,4666,5389,2701,1886,1495,1731,4076, // 3152
2370,4667,5390,2030,5391,5392,4077,2702,1216, 237,2589,4318,2324,4078,3881,4668, // 3168
4669,2703,3615,3504, 445,4670,5393,5394,5395,5396,2771,  61,4079,3738,1823,4080, // 3184
5397, 687,2046, 935, 925, 405,2670, 703,1096,1860,2734,4671,4081,1877,1367,2704, // 3200
3389, 918,2106,1782,2483, 334,3320,1611,1093,4672, 564,3171,3505,3739,3390, 945, // 3216
2641,2058,4673,5398,1926, 872,4319,5399,3506,2705,3112, 349,4320,3740,4082,4674, // 3232
3882,4321,3741,2156,4083,4675,4676,4322,4677,2408,2047, 782,4084, 400, 251,4323, // 3248
1624,5400,5401, 277,3742, 299,1265, 476,1191,3883,2122,4324,4325,1109, 205,5402, // 3264
2590,1000,2157,3616,1861,5403,5404,5405,4678,5406,4679,2573, 107,2484,2158,4085, // 3280
3507,3172,5407,1533, 541,1301, 158, 753,4326,2886,3617,5408,1696, 370,1088,4327, // 3296
4680,3618, 579, 327, 440, 162,2244, 269,1938,1374,3508, 968,3063,  56,1396,3113, // 3312
2107,3321,3391,5409,1927,2159,4681,3016,5410,3619,5411,5412,3743,4682,2485,5413, // 3328
2804,5414,1650,4683,5415,2613,5416,5417,4086,2671,3392,1149,3393,4087,3884,4088, // 3344
5418,1076,  49,5419, 951,3242,3322,3323, 450,2850, 920,5420,1812,2805,2371,4328, // 3360
1909,1138,2372,3885,3509,5421,3243,4684,1910,1147,1518,2428,4685,3886,5422,4686, // 3376
2393,2614, 260,1796,3244,5423,5424,3887,3324, 708,5425,3620,1704,5426,3621,1351, // 3392
1618,3394,3017,1887, 944,4329,3395,4330,3064,3396,4331,5427,3744, 422, 413,1714, // 3408
3325, 500,2059,2350,4332,2486,5428,1344,1911, 954,5429,1668,5430,5431,4089,2409, // 3424
4333,3622,3888,4334,5432,2307,1318,2512,3114, 133,3115,2887,4687, 629,  31,2851, // 3440
2706,3889,4688, 850, 949,4689,4090,2970,1732,2089,4335,1496,1853,5433,4091, 620, // 3456
3245, 981,1242,3745,3397,1619,3746,1643,3326,2140,2457,1971,1719,3510,2169,5434, // 3472
3246,5435,5436,3398,1829,5437,1277,4690,1565,2048,5438,1636,3623,3116,5439, 869, // 3488
2852, 655,3890,3891,3117,4092,3018,3892,1310,3624,4691,5440,5441,5442,1733, 558, // 3504
4692,3747, 335,1549,3065,1756,4336,3748,1946,3511,1830,1291,1192, 470,2735,2108, // 3520
2806, 913,1054,4093,5443,1027,5444,3066,4094,4693, 982,2672,3399,3173,3512,3247, // 3536
3248,1947,2807,5445, 571,4694,5446,1831,5447,3625,2591,1523,2429,5448,2090, 984, // 3552
4695,3749,1960,5449,3750, 852, 923,2808,3513,3751, 969,1519, 999,2049,2325,1705, // 3568
5450,3118, 615,1662, 151, 597,4095,2410,2326,1049, 275,4696,3752,4337, 568,3753, // 3584
3626,2487,4338,3754,5451,2430,2275, 409,3249,5452,1566,2888,3514,1002, 769,2853, // 3600
 194,2091,3174,3755,2226,3327,4339, 628,1505,5453,5454,1763,2180,3019,4096, 521, // 3616
1161,2592,1788,2206,2411,4697,4097,1625,4340,4341, 412,  42,3119, 464,5455,2642, // 3632
4698,3400,1760,1571,2889,3515,2537,1219,2207,3893,2643,2141,2373,4699,4700,3328, // 3648
1651,3401,3627,5456,5457,3628,2488,3516,5458,3756,5459,5460,2276,2092, 460,5461, // 3664
4701,5462,3020, 962, 588,3629, 289,3250,2644,1116,  52,5463,3067,1797,5464,5465, // 3680
5466,1467,5467,1598,1143,3757,4342,1985,1734,1067,4702,1280,3402, 465,4703,1572, // 3696
 510,5468,1928,2245,1813,1644,3630,5469,4704,3758,5470,5471,2673,1573,1534,5472, // 3712
5473, 536,1808,1761,3517,3894,3175,2645,5474,5475,5476,4705,3518,2929,1912,2809, // 3728
5477,3329,1122, 377,3251,5478, 360,5479,5480,4343,1529, 551,5481,2060,3759,1769, // 3744
2431,5482,2930,4344,3330,3120,2327,2109,2031,4706,1404, 136,1468,1479, 672,1171, // 3760
3252,2308, 271,3176,5483,2772,5484,2050, 678,2736, 865,1948,4707,5485,2014,4098, // 3776
2971,5486,2737,2227,1397,3068,3760,4708,4709,1735,2931,3403,3631,5487,3895, 509, // 3792
2854,2458,2890,3896,5488,5489,3177,3178,4710,4345,2538,4711,2309,1166,1010, 552, // 3808
 681,1888,5490,5491,2972,2973,4099,1287,1596,1862,3179, 358, 453, 736, 175, 478, // 3824
1117, 905,1167,1097,5492,1854,1530,5493,1706,5494,2181,3519,2292,3761,3520,3632, // 3840
4346,2093,4347,5495,3404,1193,2489,4348,1458,2193,2208,1863,1889,1421,3331,2932, // 3856
3069,2182,3521, 595,2123,5496,4100,5497,5498,4349,1707,2646, 223,3762,1359, 751, // 3872
3121, 183,3522,5499,2810,3021, 419,2374, 633, 704,3897,2394, 241,5500,5501,5502, // 3888
 838,3022,3763,2277,2773,2459,3898,1939,2051,4101,1309,3122,2246,1181,5503,1136, // 3904
2209,3899,2375,1446,4350,2310,4712,5504,5505,4351,1055,2615, 484,3764,5506,4102, // 3920
 625,4352,2278,3405,1499,4353,4103,5507,4104,4354,3253,2279,2280,3523,5508,5509, // 3936
2774, 808,2616,3765,3406,4105,4355,3123,2539, 526,3407,3900,4356, 955,5510,1620, // 3952
4357,2647,2432,5511,1429,3766,1669,1832, 994, 928,5512,3633,1260,5513,5514,5515, // 3968
1949,2293, 741,2933,1626,4358,2738,2460, 867,1184, 362,3408,1392,5516,5517,4106, // 3984
4359,1770,1736,3254,2934,4713,4714,1929,2707,1459,1158,5518,3070,3409,2891,1292, // 4000
1930,2513,2855,3767,1986,1187,2072,2015,2617,4360,5519,2574,2514,2170,3768,2490, // 4016
3332,5520,3769,4715,5521,5522, 666,1003,3023,1022,3634,4361,5523,4716,1814,2257, // 4032
 574,3901,1603, 295,1535, 705,3902,4362, 283, 858, 417,5524,5525,3255,4717,4718, // 4048
3071,1220,1890,1046,2281,2461,4107,1393,1599, 689,2575, 388,4363,5526,2491, 802, // 4064
5527,2811,3903,2061,1405,2258,5528,4719,3904,2110,1052,1345,3256,1585,5529, 809, // 4080
5530,5531,5532, 575,2739,3524, 956,1552,1469,1144,2328,5533,2329,1560,2462,3635, // 4096
3257,4108, 616,2210,4364,3180,2183,2294,5534,1833,5535,3525,4720,5536,1319,3770, // 4112
3771,1211,3636,1023,3258,1293,2812,5537,5538,5539,3905, 607,2311,3906, 762,2892, // 4128
1439,4365,1360,4721,1485,3072,5540,4722,1038,4366,1450,2062,2648,4367,1379,4723, // 4144
2593,5541,5542,4368,1352,1414,2330,2935,1172,5543,5544,3907,3908,4724,1798,1451, // 4160
5545,5546,5547,5548,2936,4109,4110,2492,2351, 411,4111,4112,3637,3333,3124,4725, // 4176
1561,2674,1452,4113,1375,5549,5550,  47,2974, 316,5551,1406,1591,2937,3181,5552, // 4192
1025,2142,3125,3182, 354,2740, 884,2228,4369,2412, 508,3772, 726,3638, 996,2433, // 4208
3639, 729,5553, 392,2194,1453,4114,4726,3773,5554,5555,2463,3640,2618,1675,2813, // 4224
 919,2352,2975,2353,1270,4727,4115,  73,5556,5557, 647,5558,3259,2856,2259,1550, // 4240
1346,3024,5559,1332, 883,3526,5560,5561,5562,5563,3334,2775,5564,1212, 831,1347, // 4256
4370,4728,2331,3909,1864,3073, 720,3910,4729,4730,3911,5565,4371,5566,5567,4731, // 4272
5568,5569,1799,4732,3774,2619,4733,3641,1645,2376,4734,5570,2938, 669,2211,2675, // 4288
2434,5571,2893,5572,5573,1028,3260,5574,4372,2413,5575,2260,1353,5576,5577,4735, // 4304
3183, 518,5578,4116,5579,4373,1961,5580,2143,4374,5581,5582,3025,2354,2355,3912, // 4320
 516,1834,1454,4117,2708,4375,4736,2229,2620,1972,1129,3642,5583,2776,5584,2976, // 4336
1422, 577,1470,3026,1524,3410,5585,5586, 432,4376,3074,3527,5587,2594,1455,2515, // 4352
2230,1973,1175,5588,1020,2741,4118,3528,4737,5589,2742,5590,1743,1361,3075,3529, // 4368
2649,4119,4377,4738,2295, 895, 924,4378,2171, 331,2247,3076, 166,1627,3077,1098, // 4384
5591,1232,2894,2231,3411,4739, 657, 403,1196,2377, 542,3775,3412,1600,4379,3530, // 4400
5592,4740,2777,3261, 576, 530,1362,4741,4742,2540,2676,3776,4120,5593, 842,3913, // 4416
5594,2814,2032,1014,4121, 213,2709,3413, 665, 621,4380,5595,3777,2939,2435,5596, // 4432
2436,3335,3643,3414,4743,4381,2541,4382,4744,3644,1682,4383,3531,1380,5597, 724, // 4448
2282, 600,1670,5598,1337,1233,4745,3126,2248,5599,1621,4746,5600, 651,4384,5601, // 4464
1612,4385,2621,5602,2857,5603,2743,2312,3078,5604, 716,2464,3079, 174,1255,2710, // 4480
4122,3645, 548,1320,1398, 728,4123,1574,5605,1891,1197,3080,4124,5606,3081,3082, // 4496
3778,3646,3779, 747,5607, 635,4386,4747,5608,5609,5610,4387,5611,5612,4748,5613, // 4512
3415,4749,2437, 451,5614,3780,2542,2073,4388,2744,4389,4125,5615,1764,4750,5616, // 4528
4390, 350,4751,2283,2395,2493,5617,4391,4126,2249,1434,4127, 488,4752, 458,4392, // 4544
4128,3781, 771,1330,2396,3914,2576,3184,2160,2414,1553,2677,3185,4393,5618,2494, // 4560
2895,2622,1720,2711,4394,3416,4753,5619,2543,4395,5620,3262,4396,2778,5621,2016, // 4576
2745,5622,1155,1017,3782,3915,5623,3336,2313, 201,1865,4397,1430,5624,4129,5625, // 4592
5626,5627,5628,5629,4398,1604,5630, 414,1866, 371,2595,4754,4755,3532,2017,3127, // 4608
4756,1708, 960,4399, 887, 389,2172,1536,1663,1721,5631,2232,4130,2356,2940,1580, // 4624
5632,5633,1744,4757,2544,4758,4759,5634,4760,5635,2074,5636,4761,3647,3417,2896, // 4640
4400,5637,4401,2650,3418,2815, 673,2712,2465, 709,3533,4131,3648,4402,5638,1148, // 4656
 502, 634,5639,5640,1204,4762,3649,1575,4763,2623,3783,5641,3784,3128, 948,3263, // 4672
 121,1745,3916,1110,5642,4403,3083,2516,3027,4132,3785,1151,1771,3917,1488,4133, // 4688
1987,5643,2438,3534,5644,5645,2094,5646,4404,3918,1213,1407,2816, 531,2746,2545, // 4704
3264,1011,1537,4764,2779,4405,3129,1061,5647,3786,3787,1867,2897,5648,2018, 120, // 4720
4406,4407,2063,3650,3265,2314,3919,2678,3419,1955,4765,4134,5649,3535,1047,2713, // 4736
1266,5650,1368,4766,2858, 649,3420,3920,2546,2747,1102,2859,2679,5651,5652,2000, // 4752
5653,1111,3651,2977,5654,2495,3921,3652,2817,1855,3421,3788,5655,5656,3422,2415, // 4768
2898,3337,3266,3653,5657,2577,5658,3654,2818,4135,1460, 856,5659,3655,5660,2899, // 4784
2978,5661,2900,3922,5662,4408, 632,2517, 875,3923,1697,3924,2296,5663,5664,4767, // 4800
3028,1239, 580,4768,4409,5665, 914, 936,2075,1190,4136,1039,2124,5666,5667,5668, // 4816
5669,3423,1473,5670,1354,4410,3925,4769,2173,3084,4137, 915,3338,4411,4412,3339, // 4832
1605,1835,5671,2748, 398,3656,4413,3926,4138, 328,1913,2860,4139,3927,1331,4414, // 4848
3029, 937,4415,5672,3657,4140,4141,3424,2161,4770,3425, 524, 742, 538,3085,1012, // 4864
5673,5674,3928,2466,5675, 658,1103, 225,3929,5676,5677,4771,5678,4772,5679,3267, // 4880
1243,5680,4142, 963,2250,4773,5681,2714,3658,3186,5682,5683,2596,2332,5684,4774, // 4896
5685,5686,5687,3536, 957,3426,2547,2033,1931,2941,2467, 870,2019,3659,1746,2780, // 4912
2781,2439,2468,5688,3930,5689,3789,3130,3790,3537,3427,3791,5690,1179,3086,5691, // 4928
3187,2378,4416,3792,2548,3188,3131,2749,4143,5692,3428,1556,2549,2297, 977,2901, // 4944
2034,4144,1205,3429,5693,1765,3430,3189,2125,1271, 714,1689,4775,3538,5694,2333, // 4960
3931, 533,4417,3660,2184, 617,5695,2469,3340,3539,2315,5696,5697,3190,5698,5699, // 4976
3932,1988, 618, 427,2651,3540,3431,5700,5701,1244,1690,5702,2819,4418,4776,5703, // 4992
3541,4777,5704,2284,1576, 473,3661,4419,3432, 972,5705,3662,5706,3087,5707,5708, // 5008
4778,4779,5709,3793,4145,4146,5710, 153,4780, 356,5711,1892,2902,4420,2144, 408, // 5024
 803,2357,5712,3933,5713,4421,1646,2578,2518,4781,4782,3934,5714,3935,4422,5715, // 5040
2416,3433, 752,5716,5717,1962,3341,2979,5718, 746,3030,2470,4783,4423,3794, 698, // 5056
4784,1893,4424,3663,2550,4785,3664,3936,5719,3191,3434,5720,1824,1302,4147,2715, // 5072
3937,1974,4425,5721,4426,3192, 823,1303,1288,1236,2861,3542,4148,3435, 774,3938, // 5088
5722,1581,4786,1304,2862,3939,4787,5723,2440,2162,1083,3268,4427,4149,4428, 344, // 5104
1173, 288,2316, 454,1683,5724,5725,1461,4788,4150,2597,5726,5727,4789, 985, 894, // 5120
5728,3436,3193,5729,1914,2942,3795,1989,5730,2111,1975,5731,4151,5732,2579,1194, // 5136
 425,5733,4790,3194,1245,3796,4429,5734,5735,2863,5736, 636,4791,1856,3940, 760, // 5152
1800,5737,4430,2212,1508,4792,4152,1894,1684,2298,5738,5739,4793,4431,4432,2213, // 5168
 479,5740,5741, 832,5742,4153,2496,5743,2980,2497,3797, 990,3132, 627,1815,2652, // 5184
4433,1582,4434,2126,2112,3543,4794,5744, 799,4435,3195,5745,4795,2113,1737,3031, // 5200
1018, 543, 754,4436,3342,1676,4796,4797,4154,4798,1489,5746,3544,5747,2624,2903, // 5216
4155,5748,5749,2981,5750,5751,5752,5753,3196,4799,4800,2185,1722,5754,3269,3270, // 5232
1843,3665,1715, 481, 365,1976,1857,5755,5756,1963,2498,4801,5757,2127,3666,3271, // 5248
 433,1895,2064,2076,5758, 602,2750,5759,5760,5761,5762,5763,3032,1628,3437,5764, // 5264
3197,4802,4156,2904,4803,2519,5765,2551,2782,5766,5767,5768,3343,4804,2905,5769, // 5280
4805,5770,2864,4806,4807,1221,2982,4157,2520,5771,5772,5773,1868,1990,5774,5775, // 5296
5776,1896,5777,5778,4808,1897,4158, 318,5779,2095,4159,4437,5780,5781, 485,5782, // 5312
 938,3941, 553,2680, 116,5783,3942,3667,5784,3545,2681,2783,3438,3344,2820,5785, // 5328
3668,2943,4160,1747,2944,2983,5786,5787, 207,5788,4809,5789,4810,2521,5790,3033, // 5344
 890,3669,3943,5791,1878,3798,3439,5792,2186,2358,3440,1652,5793,5794,5795, 941, // 5360
2299, 208,3546,4161,2020, 330,4438,3944,2906,2499,3799,4439,4811,5796,5797,5798, // 5376  //last 512
//Everything below is of no interest for detection purpose
2522,1613,4812,5799,3345,3945,2523,5800,4162,5801,1637,4163,2471,4813,3946,5802, // 5392
2500,3034,3800,5803,5804,2195,4814,5805,2163,5806,5807,5808,5809,5810,5811,5812, // 5408
5813,5814,5815,5816,5817,5818,5819,5820,5821,5822,5823,5824,5825,5826,5827,5828, // 5424
5829,5830,5831,5832,5833,5834,5835,5836,5837,5838,5839,5840,5841,5842,5843,5844, // 5440
5845,5846,5847,5848,5849,5850,5851,5852,5853,5854,5855,5856,5857,5858,5859,5860, // 5456
5861,5862,5863,5864,5865,5866,5867,5868,5869,5870,5871,5872,5873,5874,5875,5876, // 5472
5877,5878,5879,5880,5881,5882,5883,5884,5885,5886,5887,5888,5889,5890,5891,5892, // 5488
5893,5894,5895,5896,5897,5898,5899,5900,5901,5902,5903,5904,5905,5906,5907,5908, // 5504
5909,5910,5911,5912,5913,5914,5915,5916,5917,5918,5919,5920,5921,5922,5923,5924, // 5520
5925,5926,5927,5928,5929,5930,5931,5932,5933,5934,5935,5936,5937,5938,5939,5940, // 5536
5941,5942,5943,5944,5945,5946,5947,5948,5949,5950,5951,5952,5953,5954,5955,5956, // 5552
5957,5958,5959,5960,5961,5962,5963,5964,5965,5966,5967,5968,5969,5970,5971,5972, // 5568
5973,5974,5975,5976,5977,5978,5979,5980,5981,5982,5983,5984,5985,5986,5987,5988, // 5584
5989,5990,5991,5992,5993,5994,5995,5996,5997,5998,5999,6000,6001,6002,6003,6004, // 5600
6005,6006,6007,6008,6009,6010,6011,6012,6013,6014,6015,6016,6017,6018,6019,6020, // 5616
6021,6022,6023,6024,6025,6026,6027,6028,6029,6030,6031,6032,6033,6034,6035,6036, // 5632
6037,6038,6039,6040,6041,6042,6043,6044,6045,6046,6047,6048,6049,6050,6051,6052, // 5648
6053,6054,6055,6056,6057,6058,6059,6060,6061,6062,6063,6064,6065,6066,6067,6068, // 5664
6069,6070,6071,6072,6073,6074,6075,6076,6077,6078,6079,6080,6081,6082,6083,6084, // 5680
6085,6086,6087,6088,6089,6090,6091,6092,6093,6094,6095,6096,6097,6098,6099,6100, // 5696
6101,6102,6103,6104,6105,6106,6107,6108,6109,6110,6111,6112,6113,6114,6115,6116, // 5712
6117,6118,6119,6120,6121,6122,6123,6124,6125,6126,6127,6128,6129,6130,6131,6132, // 5728
6133,6134,6135,6136,6137,6138,6139,6140,6141,6142,6143,6144,6145,6146,6147,6148, // 5744
6149,6150,6151,6152,6153,6154,6155,6156,6157,6158,6159,6160,6161,6162,6163,6164, // 5760
6165,6166,6167,6168,6169,6170,6171,6172,6173,6174,6175,6176,6177,6178,6179,6180, // 5776
6181,6182,6183,6184,6185,6186,6187,6188,6189,6190,6191,6192,6193,6194,6195,6196, // 5792
6197,6198,6199,6200,6201,6202,6203,6204,6205,6206,6207,6208,6209,6210,6211,6212, // 5808
6213,6214,6215,6216,6217,6218,6219,6220,6221,6222,6223,3670,6224,6225,6226,6227, // 5824
6228,6229,6230,6231,6232,6233,6234,6235,6236,6237,6238,6239,6240,6241,6242,6243, // 5840
6244,6245,6246,6247,6248,6249,6250,6251,6252,6253,6254,6255,6256,6257,6258,6259, // 5856
6260,6261,6262,6263,6264,6265,6266,6267,6268,6269,6270,6271,6272,6273,6274,6275, // 5872
6276,6277,6278,6279,6280,6281,6282,6283,6284,6285,4815,6286,6287,6288,6289,6290, // 5888
6291,6292,4816,6293,6294,6295,6296,6297,6298,6299,6300,6301,6302,6303,6304,6305, // 5904
6306,6307,6308,6309,6310,6311,4817,4818,6312,6313,6314,6315,6316,6317,6318,4819, // 5920
6319,6320,6321,6322,6323,6324,6325,6326,6327,6328,6329,6330,6331,6332,6333,6334, // 5936
6335,6336,6337,4820,6338,6339,6340,6341,6342,6343,6344,6345,6346,6347,6348,6349, // 5952
6350,6351,6352,6353,6354,6355,6356,6357,6358,6359,6360,6361,6362,6363,6364,6365, // 5968
6366,6367,6368,6369,6370,6371,6372,6373,6374,6375,6376,6377,6378,6379,6380,6381, // 5984
6382,6383,6384,6385,6386,6387,6388,6389,6390,6391,6392,6393,6394,6395,6396,6397, // 6000
6398,6399,6400,6401,6402,6403,6404,6405,6406,6407,6408,6409,6410,3441,6411,6412, // 6016
6413,6414,6415,6416,6417,6418,6419,6420,6421,6422,6423,6424,6425,4440,6426,6427, // 6032
6428,6429,6430,6431,6432,6433,6434,6435,6436,6437,6438,6439,6440,6441,6442,6443, // 6048
6444,6445,6446,6447,6448,6449,6450,6451,6452,6453,6454,4821,6455,6456,6457,6458, // 6064
6459,6460,6461,6462,6463,6464,6465,6466,6467,6468,6469,6470,6471,6472,6473,6474, // 6080
6475,6476,6477,3947,3948,6478,6479,6480,6481,3272,4441,6482,6483,6484,6485,4442, // 6096
6486,6487,6488,6489,6490,6491,6492,6493,6494,6495,6496,4822,6497,6498,6499,6500, // 6112
6501,6502,6503,6504,6505,6506,6507,6508,6509,6510,6511,6512,6513,6514,6515,6516, // 6128
6517,6518,6519,6520,6521,6522,6523,6524,6525,6526,6527,6528,6529,6530,6531,6532, // 6144
6533,6534,6535,6536,6537,6538,6539,6540,6541,6542,6543,6544,6545,6546,6547,6548, // 6160
6549,6550,6551,6552,6553,6554,6555,6556,2784,6557,4823,6558,6559,6560,6561,6562, // 6176
6563,6564,6565,6566,6567,6568,6569,3949,6570,6571,6572,4824,6573,6574,6575,6576, // 6192
6577,6578,6579,6580,6581,6582,6583,4825,6584,6585,6586,3950,2785,6587,6588,6589, // 6208
6590,6591,6592,6593,6594,6595,6596,6597,6598,6599,6600,6601,6602,6603,6604,6605, // 6224
6606,6607,6608,6609,6610,6611,6612,4826,6613,6614,6615,4827,6616,6617,6618,6619, // 6240
6620,6621,6622,6623,6624,6625,4164,6626,6627,6628,6629,6630,6631,6632,6633,6634, // 6256
3547,6635,4828,6636,6637,6638,6639,6640,6641,6642,3951,2984,6643,6644,6645,6646, // 6272
6647,6648,6649,4165,6650,4829,6651,6652,4830,6653,6654,6655,6656,6657,6658,6659, // 6288
6660,6661,6662,4831,6663,6664,6665,6666,6667,6668,6669,6670,6671,4166,6672,4832, // 6304
3952,6673,6674,6675,6676,4833,6677,6678,6679,4167,6680,6681,6682,3198,6683,6684, // 6320
6685,6686,6687,6688,6689,6690,6691,6692,6693,6694,6695,6696,6697,4834,6698,6699, // 6336
6700,6701,6702,6703,6704,6705,6706,6707,6708,6709,6710,6711,6712,6713,6714,6715, // 6352
6716,6717,6718,6719,6720,6721,6722,6723,6724,6725,6726,6727,6728,6729,6730,6731, // 6368
6732,6733,6734,4443,6735,6736,6737,6738,6739,6740,6741,6742,6743,6744,6745,4444, // 6384
6746,6747,6748,6749,6750,6751,6752,6753,6754,6755,6756,6757,6758,6759,6760,6761, // 6400
6762,6763,6764,6765,6766,6767,6768,6769,6770,6771,6772,6773,6774,6775,6776,6777, // 6416
6778,6779,6780,6781,4168,6782,6783,3442,6784,6785,6786,6787,6788,6789,6790,6791, // 6432
4169,6792,6793,6794,6795,6796,6797,6798,6799,6800,6801,6802,6803,6804,6805,6806, // 6448
6807,6808,6809,6810,6811,4835,6812,6813,6814,4445,6815,6816,4446,6817,6818,6819, // 6464
6820,6821,6822,6823,6824,6825,6826,6827,6828,6829,6830,6831,6832,6833,6834,6835, // 6480
3548,6836,6837,6838,6839,6840,6841,6842,6843,6844,6845,6846,4836,6847,6848,6849, // 6496
6850,6851,6852,6853,6854,3953,6855,6856,6857,6858,6859,6860,6861,6862,6863,6864, // 6512
6865,6866,6867,6868,6869,6870,6871,6872,6873,6874,6875,6876,6877,3199,6878,6879, // 6528
6880,6881,6882,4447,6883,6884,6885,6886,6887,6888,6889,6890,6891,6892,6893,6894, // 6544
6895,6896,6897,6898,6899,6900,6901,6902,6903,6904,4170,6905,6906,6907,6908,6909, // 6560
6910,6911,6912,6913,6914,6915,6916,6917,6918,6919,6920,6921,6922,6923,6924,6925, // 6576
6926,6927,4837,6928,6929,6930,6931,6932,6933,6934,6935,6936,3346,6937,6938,4838, // 6592
6939,6940,6941,4448,6942,6943,6944,6945,6946,4449,6947,6948,6949,6950,6951,6952, // 6608
6953,6954,6955,6956,6957,6958,6959,6960,6961,6962,6963,6964,6965,6966,6967,6968, // 6624
6969,6970,6971,6972,6973,6974,6975,6976,6977,6978,6979,6980,6981,6982,6983,6984, // 6640
6985,6986,6987,6988,6989,6990,6991,6992,6993,6994,3671,6995,6996,6997,6998,4839, // 6656
6999,7000,7001,7002,3549,7003,7004,7005,7006,7007,7008,7009,7010,7011,7012,7013, // 6672
7014,7015,7016,7017,7018,7019,7020,7021,7022,7023,7024,7025,7026,7027,7028,7029, // 6688
7030,4840,7031,7032,7033,7034,7035,7036,7037,7038,4841,7039,7040,7041,7042,7043, // 6704
7044,7045,7046,7047,7048,7049,7050,7051,7052,7053,7054,7055,7056,7057,7058,7059, // 6720
7060,7061,7062,7063,7064,7065,7066,7067,7068,7069,7070,2985,7071,7072,7073,7074, // 6736
7075,7076,7077,7078,7079,7080,4842,7081,7082,7083,7084,7085,7086,7087,7088,7089, // 6752
7090,7091,7092,7093,7094,7095,7096,7097,7098,7099,7100,7101,7102,7103,7104,7105, // 6768
7106,7107,7108,7109,7110,7111,7112,7113,7114,7115,7116,7117,7118,4450,7119,7120, // 6784
7121,7122,7123,7124,7125,7126,7127,7128,7129,7130,7131,7132,7133,7134,7135,7136, // 6800
7137,7138,7139,7140,7141,7142,7143,4843,7144,7145,7146,7147,7148,7149,7150,7151, // 6816
7152,7153,7154,7155,7156,7157,7158,7159,7160,7161,7162,7163,7164,7165,7166,7167, // 6832
7168,7169,7170,7171,7172,7173,7174,7175,7176,7177,7178,7179,7180,7181,7182,7183, // 6848
7184,7185,7186,7187,7188,4171,4172,7189,7190,7191,7192,7193,7194,7195,7196,7197, // 6864
7198,7199,7200,7201,7202,7203,7204,7205,7206,7207,7208,7209,7210,7211,7212,7213, // 6880
7214,7215,7216,7217,7218,7219,7220,7221,7222,7223,7224,7225,7226,7227,7228,7229, // 6896
7230,7231,7232,7233,7234,7235,7236,7237,7238,7239,7240,7241,7242,7243,7244,7245, // 6912
7246,7247,7248,7249,7250,7251,7252,7253,7254,7255,7256,7257,7258,7259,7260,7261, // 6928
7262,7263,7264,7265,7266,7267,7268,7269,7270,7271,7272,7273,7274,7275,7276,7277, // 6944
7278,7279,7280,7281,7282,7283,7284,7285,7286,7287,7288,7289,7290,7291,7292,7293, // 6960
7294,7295,7296,4844,7297,7298,7299,7300,7301,7302,7303,7304,7305,7306,7307,7308, // 6976
7309,7310,7311,7312,7313,7314,7315,7316,4451,7317,7318,7319,7320,7321,7322,7323, // 6992
7324,7325,7326,7327,7328,7329,7330,7331,7332,7333,7334,7335,7336,7337,7338,7339, // 7008
7340,7341,7342,7343,7344,7345,7346,7347,7348,7349,7350,7351,7352,7353,4173,7354, // 7024
7355,4845,7356,7357,7358,7359,7360,7361,7362,7363,7364,7365,7366,7367,7368,7369, // 7040
7370,7371,7372,7373,7374,7375,7376,7377,7378,7379,7380,7381,7382,7383,7384,7385, // 7056
7386,7387,7388,4846,7389,7390,7391,7392,7393,7394,7395,7396,7397,7398,7399,7400, // 7072
7401,7402,7403,7404,7405,3672,7406,7407,7408,7409,7410,7411,7412,7413,7414,7415, // 7088
7416,7417,7418,7419,7420,7421,7422,7423,7424,7425,7426,7427,7428,7429,7430,7431, // 7104
7432,7433,7434,7435,7436,7437,7438,7439,7440,7441,7442,7443,7444,7445,7446,7447, // 7120
7448,7449,7450,7451,7452,7453,4452,7454,3200,7455,7456,7457,7458,7459,7460,7461, // 7136
7462,7463,7464,7465,7466,7467,7468,7469,7470,7471,7472,7473,7474,4847,7475,7476, // 7152
7477,3133,7478,7479,7480,7481,7482,7483,7484,7485,7486,7487,7488,7489,7490,7491, // 7168
7492,7493,7494,7495,7496,7497,7498,7499,7500,7501,7502,3347,7503,7504,7505,7506, // 7184
7507,7508,7509,7510,7511,7512,7513,7514,7515,7516,7517,7518,7519,7520,7521,4848, // 7200
7522,7523,7524,7525,7526,7527,7528,7529,7530,7531,7532,7533,7534,7535,7536,7537, // 7216
7538,7539,7540,7541,7542,7543,7544,7545,7546,7547,7548,7549,3801,4849,7550,7551, // 7232
7552,7553,7554,7555,7556,7557,7558,7559,7560,7561,7562,7563,7564,7565,7566,7567, // 7248
7568,7569,3035,7570,7571,7572,7573,7574,7575,7576,7577,7578,7579,7580,7581,7582, // 7264
7583,7584,7585,7586,7587,7588,7589,7590,7591,7592,7593,7594,7595,7596,7597,7598, // 7280
7599,7600,7601,7602,7603,7604,7605,7606,7607,7608,7609,7610,7611,7612,7613,7614, // 7296
7615,7616,4850,7617,7618,3802,7619,7620,7621,7622,7623,7624,7625,7626,7627,7628, // 7312
7629,7630,7631,7632,4851,7633,7634,7635,7636,7637,7638,7639,7640,7641,7642,7643, // 7328
7644,7645,7646,7647,7648,7649,7650,7651,7652,7653,7654,7655,7656,7657,7658,7659, // 7344
7660,7661,7662,7663,7664,7665,7666,7667,7668,7669,7670,4453,7671,7672,7673,7674, // 7360
7675,7676,7677,7678,7679,7680,7681,7682,7683,7684,7685,7686,7687,7688,7689,7690, // 7376
7691,7692,7693,7694,7695,7696,7697,3443,7698,7699,7700,7701,7702,4454,7703,7704, // 7392
7705,7706,7707,7708,7709,7710,7711,7712,7713,2472,7714,7715,7716,7717,7718,7719, // 7408
7720,7721,7722,7723,7724,7725,7726,7727,7728,7729,7730,7731,3954,7732,7733,7734, // 7424
7735,7736,7737,7738,7739,7740,7741,7742,7743,7744,7745,7746,7747,7748,7749,7750, // 7440
3134,7751,7752,4852,7753,7754,7755,4853,7756,7757,7758,7759,7760,4174,7761,7762, // 7456
7763,7764,7765,7766,7767,7768,7769,7770,7771,7772,7773,7774,7775,7776,7777,7778, // 7472
7779,7780,7781,7782,7783,7784,7785,7786,7787,7788,7789,7790,7791,7792,7793,7794, // 7488
7795,7796,7797,7798,7799,7800,7801,7802,7803,7804,7805,4854,7806,7807,7808,7809, // 7504
7810,7811,7812,7813,7814,7815,7816,7817,7818,7819,7820,7821,7822,7823,7824,7825, // 7520
4855,7826,7827,7828,7829,7830,7831,7832,7833,7834,7835,7836,7837,7838,7839,7840, // 7536
7841,7842,7843,7844,7845,7846,7847,3955,7848,7849,7850,7851,7852,7853,7854,7855, // 7552
7856,7857,7858,7859,7860,3444,7861,7862,7863,7864,7865,7866,7867,7868,7869,7870, // 7568
7871,7872,7873,7874,7875,7876,7877,7878,7879,7880,7881,7882,7883,7884,7885,7886, // 7584
7887,7888,7889,7890,7891,4175,7892,7893,7894,7895,7896,4856,4857,7897,7898,7899, // 7600
7900,2598,7901,7902,7903,7904,7905,7906,7907,7908,4455,7909,7910,7911,7912,7913, // 7616
7914,3201,7915,7916,7917,7918,7919,7920,7921,4858,7922,7923,7924,7925,7926,7927, // 7632
7928,7929,7930,7931,7932,7933,7934,7935,7936,7937,7938,7939,7940,7941,7942,7943, // 7648
7944,7945,7946,7947,7948,7949,7950,7951,7952,7953,7954,7955,7956,7957,7958,7959, // 7664
7960,7961,7962,7963,7964,7965,7966,7967,7968,7969,7970,7971,7972,7973,7974,7975, // 7680
7976,7977,7978,7979,7980,7981,4859,7982,7983,7984,7985,7986,7987,7988,7989,7990, // 7696
7991,7992,7993,7994,7995,7996,4860,7997,7998,7999,8000,8001,8002,8003,8004,8005, // 7712
8006,8007,8008,8009,8010,8011,8012,8013,8014,8015,8016,4176,8017,8018,8019,8020, // 7728
8021,8022,8023,4861,8024,8025,8026,8027,8028,8029,8030,8031,8032,8033,8034,8035, // 7744
8036,4862,4456,8037,8038,8039,8040,4863,8041,8042,8043,8044,8045,8046,8047,8048, // 7760
8049,8050,8051,8052,8053,8054,8055,8056,8057,8058,8059,8060,8061,8062,8063,8064, // 7776
8065,8066,8067,8068,8069,8070,8071,8072,8073,8074,8075,8076,8077,8078,8079,8080, // 7792
8081,8082,8083,8084,8085,8086,8087,8088,8089,8090,8091,8092,8093,8094,8095,8096, // 7808
8097,8098,8099,4864,4177,8100,8101,8102,8103,8104,8105,8106,8107,8108,8109,8110, // 7824
8111,8112,8113,8114,8115,8116,8117,8118,8119,8120,4178,8121,8122,8123,8124,8125, // 7840
8126,8127,8128,8129,8130,8131,8132,8133,8134,8135,8136,8137,8138,8139,8140,8141, // 7856
8142,8143,8144,8145,4865,4866,8146,8147,8148,8149,8150,8151,8152,8153,8154,8155, // 7872
8156,8157,8158,8159,8160,8161,8162,8163,8164,8165,4179,8166,8167,8168,8169,8170, // 7888
8171,8172,8173,8174,8175,8176,8177,8178,8179,8180,8181,4457,8182,8183,8184,8185, // 7904
8186,8187,8188,8189,8190,8191,8192,8193,8194,8195,8196,8197,8198,8199,8200,8201, // 7920
8202,8203,8204,8205,8206,8207,8208,8209,8210,8211,8212,8213,8214,8215,8216,8217, // 7936
8218,8219,8220,8221,8222,8223,8224,8225,8226,8227,8228,8229,8230,8231,8232,8233, // 7952
8234,8235,8236,8237,8238,8239,8240,8241,8242,8243,8244,8245,8246,8247,8248,8249, // 7968
8250,8251,8252,8253,8254,8255,8256,3445,8257,8258,8259,8260,8261,8262,4458,8263, // 7984
8264,8265,8266,8267,8268,8269,8270,8271,8272,4459,8273,8274,8275,8276,3550,8277, // 8000
8278,8279,8280,8281,8282,8283,8284,8285,8286,8287,8288,8289,4460,8290,8291,8292, // 8016
8293,8294,8295,8296,8297,8298,8299,8300,8301,8302,8303,8304,8305,8306,8307,4867, // 8032
8308,8309,8310,8311,8312,3551,8313,8314,8315,8316,8317,8318,8319,8320,8321,8322, // 8048
8323,8324,8325,8326,4868,8327,8328,8329,8330,8331,8332,8333,8334,8335,8336,8337, // 8064
8338,8339,8340,8341,8342,8343,8344,8345,8346,8347,8348,8349,8350,8351,8352,8353, // 8080
8354,8355,8356,8357,8358,8359,8360,8361,8362,8363,4869,4461,8364,8365,8366,8367, // 8096
8368,8369,8370,4870,8371,8372,8373,8374,8375,8376,8377,8378,8379,8380,8381,8382, // 8112
8383,8384,8385,8386,8387,8388,8389,8390,8391,8392,8393,8394,8395,8396,8397,8398, // 8128
8399,8400,8401,8402,8403,8404,8405,8406,8407,8408,8409,8410,4871,8411,8412,8413, // 8144
8414,8415,8416,8417,8418,8419,8420,8421,8422,4462,8423,8424,8425,8426,8427,8428, // 8160
8429,8430,8431,8432,8433,2986,8434,8435,8436,8437,8438,8439,8440,8441,8442,8443, // 8176
8444,8445,8446,8447,8448,8449,8450,8451,8452,8453,8454,8455,8456,8457,8458,8459, // 8192
8460,8461,8462,8463,8464,8465,8466,8467,8468,8469,8470,8471,8472,8473,8474,8475, // 8208
8476,8477,8478,4180,8479,8480,8481,8482,8483,8484,8485,8486,8487,8488,8489,8490, // 8224
8491,8492,8493,8494,8495,8496,8497,8498,8499,8500,8501,8502,8503,8504,8505,8506, // 8240
8507,8508,8509,8510,8511,8512,8513,8514,8515,8516,8517,8518,8519,8520,8521,8522, // 8256
8523,8524,8525,8526,8527,8528,8529,8530,8531,8532,8533,8534,8535,8536,8537,8538, // 8272
8539,8540,8541,8542,8543,8544,8545,8546,8547,8548,8549,8550,8551,8552,8553,8554, // 8288
8555,8556,8557,8558,8559,8560,8561,8562,8563,8564,4872,8565,8566,8567,8568,8569, // 8304
8570,8571,8572,8573,4873,8574,8575,8576,8577,8578,8579,8580,8581,8582,8583,8584, // 8320
8585,8586,8587,8588,8589,8590,8591,8592,8593,8594,8595,8596,8597,8598,8599,8600, // 8336
8601,8602,8603,8604,8605,3803,8606,8607,8608,8609,8610,8611,8612,8613,4874,3804, // 8352
8614,8615,8616,8617,8618,8619,8620,8621,3956,8622,8623,8624,8625,8626,8627,8628, // 8368
8629,8630,8631,8632,8633,8634,8635,8636,8637,8638,2865,8639,8640,8641,8642,8643, // 8384
8644,8645,8646,8647,8648,8649,8650,8651,8652,8653,8654,8655,8656,4463,8657,8658, // 8400
8659,4875,4876,8660,8661,8662,8663,8664,8665,8666,8667,8668,8669,8670,8671,8672, // 8416
8673,8674,8675,8676,8677,8678,8679,8680,8681,4464,8682,8683,8684,8685,8686,8687, // 8432
8688,8689,8690,8691,8692,8693,8694,8695,8696,8697,8698,8699,8700,8701,8702,8703, // 8448
8704,8705,8706,8707,8708,8709,2261,8710,8711,8712,8713,8714,8715,8716,8717,8718, // 8464
8719,8720,8721,8722,8723,8724,8725,8726,8727,8728,8729,8730,8731,8732,8733,4181, // 8480
8734,8735,8736,8737,8738,8739,8740,8741,8742,8743,8744,8745,8746,8747,8748,8749, // 8496
8750,8751,8752,8753,8754,8755,8756,8757,8758,8759,8760,8761,8762,8763,4877,8764, // 8512
8765,8766,8767,8768,8769,8770,8771,8772,8773,8774,8775,8776,8777,8778,8779,8780, // 8528
8781,8782,8783,8784,8785,8786,8787,8788,4878,8789,4879,8790,8791,8792,4880,8793, // 8544
8794,8795,8796,8797,8798,8799,8800,8801,4881,8802,8803,8804,8805,8806,8807,8808, // 8560
8809,8810,8811,8812,8813,8814,8815,3957,8816,8817,8818,8819,8820,8821,8822,8823, // 8576
8824,8825,8826,8827,8828,8829,8830,8831,8832,8833,8834,8835,8836,8837,8838,8839, // 8592
8840,8841,8842,8843,8844,8845,8846,8847,4882,8848,8849,8850,8851,8852,8853,8854, // 8608
8855,8856,8857,8858,8859,8860,8861,8862,8863,8864,8865,8866,8867,8868,8869,8870, // 8624
8871,8872,8873,8874,8875,8876,8877,8878,8879,8880,8881,8882,8883,8884,3202,8885, // 8640
8886,8887,8888,8889,8890,8891,8892,8893,8894,8895,8896,8897,8898,8899,8900,8901, // 8656
8902,8903,8904,8905,8906,8907,8908,8909,8910,8911,8912,8913,8914,8915,8916,8917, // 8672
8918,8919,8920,8921,8922,8923,8924,4465,8925,8926,8927,8928,8929,8930,8931,8932, // 8688
4883,8933,8934,8935,8936,8937,8938,8939,8940,8941,8942,8943,2214,8944,8945,8946, // 8704
8947,8948,8949,8950,8951,8952,8953,8954,8955,8956,8957,8958,8959,8960,8961,8962, // 8720
8963,8964,8965,4884,8966,8967,8968,8969,8970,8971,8972,8973,8974,8975,8976,8977, // 8736
8978,8979,8980,8981,8982,8983,8984,8985,8986,8987,8988,8989,8990,8991,8992,4885, // 8752
8993,8994,8995,8996,8997,8998,8999,9000,9001,9002,9003,9004,9005,9006,9007,9008, // 8768
9009,9010,9011,9012,9013,9014,9015,9016,9017,9018,9019,9020,9021,4182,9022,9023, // 8784
9024,9025,9026,9027,9028,9029,9030,9031,9032,9033,9034,9035,9036,9037,9038,9039, // 8800
9040,9041,9042,9043,9044,9045,9046,9047,9048,9049,9050,9051,9052,9053,9054,9055, // 8816
9056,9057,9058,9059,9060,9061,9062,9063,4886,9064,9065,9066,9067,9068,9069,4887, // 8832
9070,9071,9072,9073,9074,9075,9076,9077,9078,9079,9080,9081,9082,9083,9084,9085, // 8848
9086,9087,9088,9089,9090,9091,9092,9093,9094,9095,9096,9097,9098,9099,9100,9101, // 8864
9102,9103,9104,9105,9106,9107,9108,9109,9110,9111,9112,9113,9114,9115,9116,9117, // 8880
9118,9119,9120,9121,9122,9123,9124,9125,9126,9127,9128,9129,9130,9131,9132,9133, // 8896
9134,9135,9136,9137,9138,9139,9140,9141,3958,9142,9143,9144,9145,9146,9147,9148, // 8912
9149,9150,9151,4888,9152,9153,9154,9155,9156,9157,9158,9159,9160,9161,9162,9163, // 8928
9164,9165,9166,9167,9168,9169,9170,9171,9172,9173,9174,9175,4889,9176,9177,9178, // 8944
9179,9180,9181,9182,9183,9184,9185,9186,9187,9188,9189,9190,9191,9192,9193,9194, // 8960
9195,9196,9197,9198,9199,9200,9201,9202,9203,4890,9204,9205,9206,9207,9208,9209, // 8976
9210,9211,9212,9213,9214,9215,9216,9217,9218,9219,9220,9221,9222,4466,9223,9224, // 8992
9225,9226,9227,9228,9229,9230,9231,9232,9233,9234,9235,9236,9237,9238,9239,9240, // 9008
9241,9242,9243,9244,9245,4891,9246,9247,9248,9249,9250,9251,9252,9253,9254,9255, // 9024
9256,9257,4892,9258,9259,9260,9261,4893,4894,9262,9263,9264,9265,9266,9267,9268, // 9040
9269,9270,9271,9272,9273,4467,9274,9275,9276,9277,9278,9279,9280,9281,9282,9283, // 9056
9284,9285,3673,9286,9287,9288,9289,9290,9291,9292,9293,9294,9295,9296,9297,9298, // 9072
9299,9300,9301,9302,9303,9304,9305,9306,9307,9308,9309,9310,9311,9312,9313,9314, // 9088
9315,9316,9317,9318,9319,9320,9321,9322,4895,9323,9324,9325,9326,9327,9328,9329, // 9104
9330,9331,9332,9333,9334,9335,9336,9337,9338,9339,9340,9341,9342,9343,9344,9345, // 9120
9346,9347,4468,9348,9349,9350,9351,9352,9353,9354,9355,9356,9357,9358,9359,9360, // 9136
9361,9362,9363,9364,9365,9366,9367,9368,9369,9370,9371,9372,9373,4896,9374,4469, // 9152
9375,9376,9377,9378,9379,4897,9380,9381,9382,9383,9384,9385,9386,9387,9388,9389, // 9168
9390,9391,9392,9393,9394,9395,9396,9397,9398,9399,9400,9401,9402,9403,9404,9405, // 9184
9406,4470,9407,2751,9408,9409,3674,3552,9410,9411,9412,9413,9414,9415,9416,9417, // 9200
9418,9419,9420,9421,4898,9422,9423,9424,9425,9426,9427,9428,9429,3959,9430,9431, // 9216
9432,9433,9434,9435,9436,4471,9437,9438,9439,9440,9441,9442,9443,9444,9445,9446, // 9232
9447,9448,9449,9450,3348,9451,9452,9453,9454,9455,9456,9457,9458,9459,9460,9461, // 9248
9462,9463,9464,9465,9466,9467,9468,9469,9470,9471,9472,4899,9473,9474,9475,9476, // 9264
9477,4900,9478,9479,9480,9481,9482,9483,9484,9485,9486,9487,9488,3349,9489,9490, // 9280
9491,9492,9493,9494,9495,9496,9497,9498,9499,9500,9501,9502,9503,9504,9505,9506, // 9296
9507,9508,9509,9510,9511,9512,9513,9514,9515,9516,9517,9518,9519,9520,4901,9521, // 9312
9522,9523,9524,9525,9526,4902,9527,9528,9529,9530,9531,9532,9533,9534,9535,9536, // 9328
9537,9538,9539,9540,9541,9542,9543,9544,9545,9546,9547,9548,9549,9550,9551,9552, // 9344
9553,9554,9555,9556,9557,9558,9559,9560,9561,9562,9563,9564,9565,9566,9567,9568, // 9360
9569,9570,9571,9572,9573,9574,9575,9576,9577,9578,9579,9580,9581,9582,9583,9584, // 9376
3805,9585,9586,9587,9588,9589,9590,9591,9592,9593,9594,9595,9596,9597,9598,9599, // 9392
9600,9601,9602,4903,9603,9604,9605,9606,9607,4904,9608,9609,9610,9611,9612,9613, // 9408
9614,4905,9615,9616,9617,9618,9619,9620,9621,9622,9623,9624,9625,9626,9627,9628, // 9424
9629,9630,9631,9632,4906,9633,9634,9635,9636,9637,9638,9639,9640,9641,9642,9643, // 9440
4907,9644,9645,9646,9647,9648,9649,9650,9651,9652,9653,9654,9655,9656,9657,9658, // 9456
9659,9660,9661,9662,9663,9664,9665,9666,9667,9668,9669,9670,9671,9672,4183,9673, // 9472
9674,9675,9676,9677,4908,9678,9679,9680,9681,4909,9682,9683,9684,9685,9686,9687, // 9488
9688,9689,9690,4910,9691,9692,9693,3675,9694,9695,9696,2945,9697,9698,9699,9700, // 9504
9701,9702,9703,9704,9705,4911,9706,9707,9708,9709,9710,9711,9712,9713,9714,9715, // 9520
9716,9717,9718,9719,9720,9721,9722,9723,9724,9725,9726,9727,9728,9729,9730,9731, // 9536
9732,9733,9734,9735,4912,9736,9737,9738,9739,9740,4913,9741,9742,9743,9744,9745, // 9552
9746,9747,9748,9749,9750,9751,9752,9753,9754,9755,9756,9757,9758,4914,9759,9760, // 9568
9761,9762,9763,9764,9765,9766,9767,9768,9769,9770,9771,9772,9773,9774,9775,9776, // 9584
9777,9778,9779,9780,9781,9782,4915,9783,9784,9785,9786,9787,9788,9789,9790,9791, // 9600
9792,9793,4916,9794,9795,9796,9797,9798,9799,9800,9801,9802,9803,9804,9805,9806, // 9616
9807,9808,9809,9810,9811,9812,9813,9814,9815,9816,9817,9818,9819,9820,9821,9822, // 9632
9823,9824,9825,9826,9827,9828,9829,9830,9831,9832,9833,9834,9835,9836,9837,9838, // 9648
9839,9840,9841,9842,9843,9844,9845,9846,9847,9848,9849,9850,9851,9852,9853,9854, // 9664
9855,9856,9857,9858,9859,9860,9861,9862,9863,9864,9865,9866,9867,9868,4917,9869, // 9680
9870,9871,9872,9873,9874,9875,9876,9877,9878,9879,9880,9881,9882,9883,9884,9885, // 9696
9886,9887,9888,9889,9890,9891,9892,4472,9893,9894,9895,9896,9897,3806,9898,9899, // 9712
9900,9901,9902,9903,9904,9905,9906,9907,9908,9909,9910,9911,9912,9913,9914,4918, // 9728
9915,9916,9917,4919,9918,9919,9920,9921,4184,9922,9923,9924,9925,9926,9927,9928, // 9744
9929,9930,9931,9932,9933,9934,9935,9936,9937,9938,9939,9940,9941,9942,9943,9944, // 9760
9945,9946,4920,9947,9948,9949,9950,9951,9952,9953,9954,9955,4185,9956,9957,9958, // 9776
9959,9960,9961,9962,9963,9964,9965,4921,9966,9967,9968,4473,9969,9970,9971,9972, // 9792
9973,9974,9975,9976,9977,4474,9978,9979,9980,9981,9982,9983,9984,9985,9986,9987, // 9808
9988,9989,9990,9991,9992,9993,9994,9995,9996,9997,9998,9999,10000,10001,10002,10003, // 9824
10004,10005,10006,10007,10008,10009,10010,10011,10012,10013,10014,10015,10016,10017,10018,10019, // 9840
10020,10021,4922,10022,4923,10023,10024,10025,10026,10027,10028,10029,10030,10031,10032,10033, // 9856
10034,10035,10036,10037,10038,10039,10040,10041,10042,10043,10044,10045,10046,10047,10048,4924, // 9872
10049,10050,10051,10052,10053,10054,10055,10056,10057,10058,10059,10060,10061,10062,10063,10064, // 9888
10065,10066,10067,10068,10069,10070,10071,10072,10073,10074,10075,10076,10077,10078,10079,10080, // 9904
10081,10082,10083,10084,10085,10086,10087,4475,10088,10089,10090,10091,10092,10093,10094,10095, // 9920
10096,10097,4476,10098,10099,10100,10101,10102,10103,10104,10105,10106,10107,10108,10109,10110, // 9936
10111,2174,10112,10113,10114,10115,10116,10117,10118,10119,10120,10121,10122,10123,10124,10125, // 9952
10126,10127,10128,10129,10130,10131,10132,10133,10134,10135,10136,10137,10138,10139,10140,3807, // 9968
4186,4925,10141,10142,10143,10144,10145,10146,10147,4477,4187,10148,10149,10150,10151,10152, // 9984
10153,4188,10154,10155,10156,10157,10158,10159,10160,10161,4926,10162,10163,10164,10165,10166, //10000
10167,10168,10169,10170,10171,10172,10173,10174,10175,10176,10177,10178,10179,10180,10181,10182, //10016
10183,10184,10185,10186,10187,10188,10189,10190,10191,10192,3203,10193,10194,10195,10196,10197, //10032
10198,10199,10200,4478,10201,10202,10203,10204,4479,10205,10206,10207,10208,10209,10210,10211, //10048
10212,10213,10214,10215,10216,10217,10218,10219,10220,10221,10222,10223,10224,10225,10226,10227, //10064
10228,10229,10230,10231,10232,10233,10234,4927,10235,10236,10237,10238,10239,10240,10241,10242, //10080
10243,10244,10245,10246,10247,10248,10249,10250,10251,10252,10253,10254,10255,10256,10257,10258, //10096
10259,10260,10261,10262,10263,10264,10265,10266,10267,10268,10269,10270,10271,10272,10273,4480, //10112
4928,4929,10274,10275,10276,10277,10278,10279,10280,10281,10282,10283,10284,10285,10286,10287, //10128
10288,10289,10290,10291,10292,10293,10294,10295,10296,10297,10298,10299,10300,10301,10302,10303, //10144
10304,10305,10306,10307,10308,10309,10310,10311,10312,10313,10314,10315,10316,10317,10318,10319, //10160
10320,10321,10322,10323,10324,10325,10326,10327,10328,10329,10330,10331,10332,10333,10334,4930, //10176
10335,10336,10337,10338,10339,10340,10341,10342,4931,10343,10344,10345,10346,10347,10348,10349, //10192
10350,10351,10352,10353,10354,10355,3088,10356,2786,10357,10358,10359,10360,4189,10361,10362, //10208
10363,10364,10365,10366,10367,10368,10369,10370,10371,10372,10373,10374,10375,4932,10376,10377, //10224
10378,10379,10380,10381,10382,10383,10384,10385,10386,10387,10388,10389,10390,10391,10392,4933, //10240
10393,10394,10395,4934,10396,10397,10398,10399,10400,10401,10402,10403,10404,10405,10406,10407, //10256
10408,10409,10410,10411,10412,3446,10413,10414,10415,10416,10417,10418,10419,10420,10421,10422, //10272
10423,4935,10424,10425,10426,10427,10428,10429,10430,4936,10431,10432,10433,10434,10435,10436, //10288
10437,10438,10439,10440,10441,10442,10443,4937,10444,10445,10446,10447,4481,10448,10449,10450, //10304
10451,10452,10453,10454,10455,10456,10457,10458,10459,10460,10461,10462,10463,10464,10465,10466, //10320
10467,10468,10469,10470,10471,10472,10473,10474,10475,10476,10477,10478,10479,10480,10481,10482, //10336
10483,10484,10485,10486,10487,10488,10489,10490,10491,10492,10493,10494,10495,10496,10497,10498, //10352
10499,10500,10501,10502,10503,10504,10505,4938,10506,10507,10508,10509,10510,2552,10511,10512, //10368
10513,10514,10515,10516,3447,10517,10518,10519,10520,10521,10522,10523,10524,10525,10526,10527, //10384
10528,10529,10530,10531,10532,10533,10534,10535,10536,10537,10538,10539,10540,10541,10542,10543, //10400
4482,10544,4939,10545,10546,10547,10548,10549,10550,10551,10552,10553,10554,10555,10556,10557, //10416
10558,10559,10560,10561,10562,10563,10564,10565,10566,10567,3676,4483,10568,10569,10570,10571, //10432
10572,3448,10573,10574,10575,10576,10577,10578,10579,10580,10581,10582,10583,10584,10585,10586, //10448
10587,10588,10589,10590,10591,10592,10593,10594,10595,10596,10597,10598,10599,10600,10601,10602, //10464
10603,10604,10605,10606,10607,10608,10609,10610,10611,10612,10613,10614,10615,10616,10617,10618, //10480
10619,10620,10621,10622,10623,10624,10625,10626,10627,4484,10628,10629,10630,10631,10632,4940, //10496
10633,10634,10635,10636,10637,10638,10639,10640,10641,10642,10643,10644,10645,10646,10647,10648, //10512
10649,10650,10651,10652,10653,10654,10655,10656,4941,10657,10658,10659,2599,10660,10661,10662, //10528
10663,10664,10665,10666,3089,10667,10668,10669,10670,10671,10672,10673,10674,10675,10676,10677, //10544
10678,10679,10680,4942,10681,10682,10683,10684,10685,10686,10687,10688,10689,10690,10691,10692, //10560
10693,10694,10695,10696,10697,4485,10698,10699,10700,10701,10702,10703,10704,4943,10705,3677, //10576
10706,10707,10708,10709,10710,10711,10712,4944,10713,10714,10715,10716,10717,10718,10719,10720, //10592
10721,10722,10723,10724,10725,10726,10727,10728,4945,10729,10730,10731,10732,10733,10734,10735, //10608
10736,10737,10738,10739,10740,10741,10742,10743,10744,10745,10746,10747,10748,10749,10750,10751, //10624
10752,10753,10754,10755,10756,10757,10758,10759,10760,10761,4946,10762,10763,10764,10765,10766, //10640
10767,4947,4948,10768,10769,10770,10771,10772,10773,10774,10775,10776,10777,10778,10779,10780, //10656
10781,10782,10783,10784,10785,10786,10787,10788,10789,10790,10791,10792,10793,10794,10795,10796, //10672
10797,10798,10799,10800,10801,10802,10803,10804,10805,10806,10807,10808,10809,10810,10811,10812, //10688
10813,10814,10815,10816,10817,10818,10819,10820,10821,10822,10823,10824,10825,10826,10827,10828, //10704
10829,10830,10831,10832,10833,10834,10835,10836,10837,10838,10839,10840,10841,10842,10843,10844, //10720
10845,10846,10847,10848,10849,10850,10851,10852,10853,10854,10855,10856,10857,10858,10859,10860, //10736
10861,10862,10863,10864,10865,10866,10867,10868,10869,10870,10871,10872,10873,10874,10875,10876, //10752
10877,10878,4486,10879,10880,10881,10882,10883,10884,10885,4949,10886,10887,10888,10889,10890, //10768
10891,10892,10893,10894,10895,10896,10897,10898,10899,10900,10901,10902,10903,10904,10905,10906, //10784
10907,10908,10909,10910,10911,10912,10913,10914,10915,10916,10917,10918,10919,4487,10920,10921, //10800
10922,10923,10924,10925,10926,10927,10928,10929,10930,10931,10932,4950,10933,10934,10935,10936, //10816
10937,10938,10939,10940,10941,10942,10943,10944,10945,10946,10947,10948,10949,4488,10950,10951, //10832
10952,10953,10954,10955,10956,10957,10958,10959,4190,10960,10961,10962,10963,10964,10965,10966, //10848
10967,10968,10969,10970,10971,10972,10973,10974,10975,10976,10977,10978,10979,10980,10981,10982, //10864
10983,10984,10985,10986,10987,10988,10989,10990,10991,10992,10993,10994,10995,10996,10997,10998, //10880
10999,11000,11001,11002,11003,11004,11005,11006,3960,11007,11008,11009,11010,11011,11012,11013, //10896
11014,11015,11016,11017,11018,11019,11020,11021,11022,11023,11024,11025,11026,11027,11028,11029, //10912
11030,11031,11032,4951,11033,11034,11035,11036,11037,11038,11039,11040,11041,11042,11043,11044, //10928
11045,11046,11047,4489,11048,11049,11050,11051,4952,11052,11053,11054,11055,11056,11057,11058, //10944
4953,11059,11060,11061,11062,11063,11064,11065,11066,11067,11068,11069,11070,11071,4954,11072, //10960
11073,11074,11075,11076,11077,11078,11079,11080,11081,11082,11083,11084,11085,11086,11087,11088, //10976
11089,11090,11091,11092,11093,11094,11095,11096,11097,11098,11099,11100,11101,11102,11103,11104, //10992
11105,11106,11107,11108,11109,11110,11111,11112,11113,11114,11115,3808,11116,11117,11118,11119, //11008
11120,11121,11122,11123,11124,11125,11126,11127,11128,11129,11130,11131,11132,11133,11134,4955, //11024
11135,11136,11137,11138,11139,11140,11141,11142,11143,11144,11145,11146,11147,11148,11149,11150, //11040
11151,11152,11153,11154,11155,11156,11157,11158,11159,11160,11161,4956,11162,11163,11164,11165, //11056
11166,11167,11168,11169,11170,11171,11172,11173,11174,11175,11176,11177,11178,11179,11180,4957, //11072
11181,11182,11183,11184,11185,11186,4958,11187,11188,11189,11190,11191,11192,11193,11194,11195, //11088
11196,11197,11198,11199,11200,3678,11201,11202,11203,11204,11205,11206,4191,11207,11208,11209, //11104
11210,11211,11212,11213,11214,11215,11216,11217,11218,11219,11220,11221,11222,11223,11224,11225, //11120
11226,11227,11228,11229,11230,11231,11232,11233,11234,11235,11236,11237,11238,11239,11240,11241, //11136
11242,11243,11244,11245,11246,11247,11248,11249,11250,11251,4959,11252,11253,11254,11255,11256, //11152
11257,11258,11259,11260,11261,11262,11263,11264,11265,11266,11267,11268,11269,11270,11271,11272, //11168
11273,11274,11275,11276,11277,11278,11279,11280,11281,11282,11283,11284,11285,11286,11287,11288, //11184
11289,11290,11291,11292,11293,11294,11295,11296,11297,11298,11299,11300,11301,11302,11303,11304, //11200
11305,11306,11307,11308,11309,11310,11311,11312,11313,11314,3679,11315,11316,11317,11318,4490, //11216
11319,11320,11321,11322,11323,11324,11325,11326,11327,11328,11329,11330,11331,11332,11333,11334, //11232
11335,11336,11337,11338,11339,11340,11341,11342,11343,11344,11345,11346,11347,4960,11348,11349, //11248
11350,11351,11352,11353,11354,11355,11356,11357,11358,11359,11360,11361,11362,11363,11364,11365, //11264
11366,11367,11368,11369,11370,11371,11372,11373,11374,11375,11376,11377,3961,4961,11378,11379, //11280
11380,11381,11382,11383,11384,11385,11386,11387,11388,11389,11390,11391,11392,11393,11394,11395, //11296
11396,11397,4192,11398,11399,11400,11401,11402,11403,11404,11405,11406,11407,11408,11409,11410, //11312
11411,4962,11412,11413,11414,11415,11416,11417,11418,11419,11420,11421,11422,11423,11424,11425, //11328
11426,11427,11428,11429,11430,11431,11432,11433,11434,11435,11436,11437,11438,11439,11440,11441, //11344
11442,11443,11444,11445,11446,11447,11448,11449,11450,11451,11452,11453,11454,11455,11456,11457, //11360
11458,11459,11460,11461,11462,11463,11464,11465,11466,11467,11468,11469,4963,11470,11471,4491, //11376
11472,11473,11474,11475,4964,11476,11477,11478,11479,11480,11481,11482,11483,11484,11485,11486, //11392
11487,11488,11489,11490,11491,11492,4965,11493,11494,11495,11496,11497,11498,11499,11500,11501, //11408
11502,11503,11504,11505,11506,11507,11508,11509,11510,11511,11512,11513,11514,11515,11516,11517, //11424
11518,11519,11520,11521,11522,11523,11524,11525,11526,11527,11528,11529,3962,11530,11531,11532, //11440
11533,11534,11535,11536,11537,11538,11539,11540,11541,11542,11543,11544,11545,11546,11547,11548, //11456
11549,11550,11551,11552,11553,11554,11555,11556,11557,11558,11559,11560,11561,11562,11563,11564, //11472
4193,4194,11565,11566,11567,11568,11569,11570,11571,11572,11573,11574,11575,11576,11577,11578, //11488
11579,11580,11581,11582,11583,11584,11585,11586,11587,11588,11589,11590,11591,4966,4195,11592, //11504
11593,11594,11595,11596,11597,11598,11599,11600,11601,11602,11603,11604,3090,11605,11606,11607, //11520
11608,11609,11610,4967,11611,11612,11613,11614,11615,11616,11617,11618,11619,11620,11621,11622, //11536
11623,11624,11625,11626,11627,11628,11629,11630,11631,11632,11633,11634,11635,11636,11637,11638, //11552
11639,11640,11641,11642,11643,11644,11645,11646,11647,11648,11649,11650,11651,11652,11653,11654, //11568
11655,11656,11657,11658,11659,11660,11661,11662,11663,11664,11665,11666,11667,11668,11669,11670, //11584
11671,11672,11673,11674,4968,11675,11676,11677,11678,11679,11680,11681,11682,11683,11684,11685, //11600
11686,11687,11688,11689,11690,11691,11692,11693,3809,11694,11695,11696,11697,11698,11699,11700, //11616
11701,11702,11703,11704,11705,11706,11707,11708,11709,11710,11711,11712,11713,11714,11715,11716, //11632
11717,11718,3553,11719,11720,11721,11722,11723,11724,11725,11726,11727,11728,11729,11730,4969, //11648
11731,11732,11733,11734,11735,11736,11737,11738,11739,11740,4492,11741,11742,11743,11744,11745, //11664
11746,11747,11748,11749,11750,11751,11752,4970,11753,11754,11755,11756,11757,11758,11759,11760, //11680
11761,11762,11763,11764,11765,11766,11767,11768,11769,11770,11771,11772,11773,11774,11775,11776, //11696
11777,11778,11779,11780,11781,11782,11783,11784,11785,11786,11787,11788,11789,11790,4971,11791, //11712
11792,11793,11794,11795,11796,11797,4972,11798,11799,11800,11801,11802,11803,11804,11805,11806, //11728
11807,11808,11809,11810,4973,11811,11812,11813,11814,11815,11816,11817,11818,11819,11820,11821, //11744
11822,11823,11824,11825,11826,11827,11828,11829,11830,11831,11832,11833,11834,3680,3810,11835, //11760
11836,4974,11837,11838,11839,11840,11841,11842,11843,11844,11845,11846,11847,11848,11849,11850, //11776
11851,11852,11853,11854,11855,11856,11857,11858,11859,11860,11861,11862,11863,11864,11865,11866, //11792
11867,11868,11869,11870,11871,11872,11873,11874,11875,11876,11877,11878,11879,11880,11881,11882, //11808
11883,11884,4493,11885,11886,11887,11888,11889,11890,11891,11892,11893,11894,11895,11896,11897, //11824
11898,11899,11900,11901,11902,11903,11904,11905,11906,11907,11908,11909,11910,11911,11912,11913, //11840
11914,11915,4975,11916,11917,11918,11919,11920,11921,11922,11923,11924,11925,11926,11927,11928, //11856
11929,11930,11931,11932,11933,11934,11935,11936,11937,11938,11939,11940,11941,11942,11943,11944, //11872
11945,11946,11947,11948,11949,4976,11950,11951,11952,11953,11954,11955,11956,11957,11958,11959, //11888
11960,11961,11962,11963,11964,11965,11966,11967,11968,11969,11970,11971,11972,11973,11974,11975, //11904
11976,11977,11978,11979,11980,11981,11982,11983,11984,11985,11986,11987,4196,11988,11989,11990, //11920
11991,11992,4977,11993,11994,11995,11996,11997,11998,11999,12000,12001,12002,12003,12004,12005, //11936
12006,12007,12008,12009,12010,12011,12012,12013,12014,12015,12016,12017,12018,12019,12020,12021, //11952
12022,12023,12024,12025,12026,12027,12028,12029,12030,12031,12032,12033,12034,12035,12036,12037, //11968
12038,12039,12040,12041,12042,12043,12044,12045,12046,12047,12048,12049,12050,12051,12052,12053, //11984
12054,12055,12056,12057,12058,12059,12060,12061,4978,12062,12063,12064,12065,12066,12067,12068, //12000
12069,12070,12071,12072,12073,12074,12075,12076,12077,12078,12079,12080,12081,12082,12083,12084, //12016
12085,12086,12087,12088,12089,12090,12091,12092,12093,12094,12095,12096,12097,12098,12099,12100, //12032
12101,12102,12103,12104,12105,12106,12107,12108,12109,12110,12111,12112,12113,12114,12115,12116, //12048
12117,12118,12119,12120,12121,12122,12123,4979,12124,12125,12126,12127,12128,4197,12129,12130, //12064
12131,12132,12133,12134,12135,12136,12137,12138,12139,12140,12141,12142,12143,12144,12145,12146, //12080
12147,12148,12149,12150,12151,12152,12153,12154,4980,12155,12156,12157,12158,12159,12160,4494, //12096
12161,12162,12163,12164,3811,12165,12166,12167,12168,12169,4495,12170,12171,4496,12172,12173, //12112
12174,12175,12176,3812,12177,12178,12179,12180,12181,12182,12183,12184,12185,12186,12187,12188, //12128
12189,12190,12191,12192,12193,12194,12195,12196,12197,12198,12199,12200,12201,12202,12203,12204, //12144
12205,12206,12207,12208,12209,12210,12211,12212,12213,12214,12215,12216,12217,12218,12219,12220, //12160
12221,4981,12222,12223,12224,12225,12226,12227,12228,12229,12230,12231,12232,12233,12234,12235, //12176
4982,12236,12237,12238,12239,12240,12241,12242,12243,12244,12245,4983,12246,12247,12248,12249, //12192
4984,12250,12251,12252,12253,12254,12255,12256,12257,12258,12259,12260,12261,12262,12263,12264, //12208
4985,12265,4497,12266,12267,12268,12269,12270,12271,12272,12273,12274,12275,12276,12277,12278, //12224
12279,12280,12281,12282,12283,12284,12285,12286,12287,4986,12288,12289,12290,12291,12292,12293, //12240
12294,12295,12296,2473,12297,12298,12299,12300,12301,12302,12303,12304,12305,12306,12307,12308, //12256
12309,12310,12311,12312,12313,12314,12315,12316,12317,12318,12319,3963,12320,12321,12322,12323, //12272
12324,12325,12326,12327,12328,12329,12330,12331,12332,4987,12333,12334,12335,12336,12337,12338, //12288
12339,12340,12341,12342,12343,12344,12345,12346,12347,12348,12349,12350,12351,12352,12353,12354, //12304
12355,12356,12357,12358,12359,3964,12360,12361,12362,12363,12364,12365,12366,12367,12368,12369, //12320
12370,3965,12371,12372,12373,12374,12375,12376,12377,12378,12379,12380,12381,12382,12383,12384, //12336
12385,12386,12387,12388,12389,12390,12391,12392,12393,12394,12395,12396,12397,12398,12399,12400, //12352
12401,12402,12403,12404,12405,12406,12407,12408,4988,12409,12410,12411,12412,12413,12414,12415, //12368
12416,12417,12418,12419,12420,12421,12422,12423,12424,12425,12426,12427,12428,12429,12430,12431, //12384
12432,12433,12434,12435,12436,12437,12438,3554,12439,12440,12441,12442,12443,12444,12445,12446, //12400
12447,12448,12449,12450,12451,12452,12453,12454,12455,12456,12457,12458,12459,12460,12461,12462, //12416
12463,12464,4989,12465,12466,12467,12468,12469,12470,12471,12472,12473,12474,12475,12476,12477, //12432
12478,12479,12480,4990,12481,12482,12483,12484,12485,12486,12487,12488,12489,4498,12490,12491, //12448
12492,12493,12494,12495,12496,12497,12498,12499,12500,12501,12502,12503,12504,12505,12506,12507, //12464
12508,12509,12510,12511,12512,12513,12514,12515,12516,12517,12518,12519,12520,12521,12522,12523, //12480
12524,12525,12526,12527,12528,12529,12530,12531,12532,12533,12534,12535,12536,12537,12538,12539, //12496
12540,12541,12542,12543,12544,12545,12546,12547,12548,12549,12550,12551,4991,12552,12553,12554, //12512
12555,12556,12557,12558,12559,12560,12561,12562,12563,12564,12565,12566,12567,12568,12569,12570, //12528
12571,12572,12573,12574,12575,12576,12577,12578,3036,12579,12580,12581,12582,12583,3966,12584, //12544
12585,12586,12587,12588,12589,12590,12591,12592,12593,12594,12595,12596,12597,12598,12599,12600, //12560
12601,12602,12603,12604,12605,12606,12607,12608,12609,12610,12611,12612,12613,12614,12615,12616, //12576
12617,12618,12619,12620,12621,12622,12623,12624,12625,12626,12627,12628,12629,12630,12631,12632, //12592
12633,12634,12635,12636,12637,12638,12639,12640,12641,12642,12643,12644,12645,12646,4499,12647, //12608
12648,12649,12650,12651,12652,12653,12654,12655,12656,12657,12658,12659,12660,12661,12662,12663, //12624
12664,12665,12666,12667,12668,12669,12670,12671,12672,12673,12674,12675,12676,12677,12678,12679, //12640
12680,12681,12682,12683,12684,12685,12686,12687,12688,12689,12690,12691,12692,12693,12694,12695, //12656
12696,12697,12698,4992,12699,12700,12701,12702,12703,12704,12705,12706,12707,12708,12709,12710, //12672
12711,12712,12713,12714,12715,12716,12717,12718,12719,12720,12721,12722,12723,12724,12725,12726, //12688
12727,12728,12729,12730,12731,12732,12733,12734,12735,12736,12737,12738,12739,12740,12741,12742, //12704
12743,12744,12745,12746,12747,12748,12749,12750,12751,12752,12753,12754,12755,12756,12757,12758, //12720
12759,12760,12761,12762,12763,12764,12765,12766,12767,12768,12769,12770,12771,12772,12773,12774, //12736
12775,12776,12777,12778,4993,2175,12779,12780,12781,12782,12783,12784,12785,12786,4500,12787, //12752
12788,12789,12790,12791,12792,12793,12794,12795,12796,12797,12798,12799,12800,12801,12802,12803, //12768
12804,12805,12806,12807,12808,12809,12810,12811,12812,12813,12814,12815,12816,12817,12818,12819, //12784
12820,12821,12822,12823,12824,12825,12826,4198,3967,12827,12828,12829,12830,12831,12832,12833, //12800
12834,12835,12836,12837,12838,12839,12840,12841,12842,12843,12844,12845,12846,12847,12848,12849, //12816
12850,12851,12852,12853,12854,12855,12856,12857,12858,12859,12860,12861,4199,12862,12863,12864, //12832
12865,12866,12867,12868,12869,12870,12871,12872,12873,12874,12875,12876,12877,12878,12879,12880, //12848
12881,12882,12883,12884,12885,12886,12887,4501,12888,12889,12890,12891,12892,12893,12894,12895, //12864
12896,12897,12898,12899,12900,12901,12902,12903,12904,12905,12906,12907,12908,12909,12910,12911, //12880
12912,4994,12913,12914,12915,12916,12917,12918,12919,12920,12921,12922,12923,12924,12925,12926, //12896
12927,12928,12929,12930,12931,12932,12933,12934,12935,12936,12937,12938,12939,12940,12941,12942, //12912
12943,12944,12945,12946,12947,12948,12949,12950,12951,12952,12953,12954,12955,12956,1772,12957, //12928
12958,12959,12960,12961,12962,12963,12964,12965,12966,12967,12968,12969,12970,12971,12972,12973, //12944
12974,12975,12976,12977,12978,12979,12980,12981,12982,12983,12984,12985,12986,12987,12988,12989, //12960
12990,12991,12992,12993,12994,12995,12996,12997,4502,12998,4503,12999,13000,13001,13002,13003, //12976
4504,13004,13005,13006,13007,13008,13009,13010,13011,13012,13013,13014,13015,13016,13017,13018, //12992
13019,13020,13021,13022,13023,13024,13025,13026,13027,13028,13029,3449,13030,13031,13032,13033, //13008
13034,13035,13036,13037,13038,13039,13040,13041,13042,13043,13044,13045,13046,13047,13048,13049, //13024
13050,13051,13052,13053,13054,13055,13056,13057,13058,13059,13060,13061,13062,13063,13064,13065, //13040
13066,13067,13068,13069,13070,13071,13072,13073,13074,13075,13076,13077,13078,13079,13080,13081, //13056
13082,13083,13084,13085,13086,13087,13088,13089,13090,13091,13092,13093,13094,13095,13096,13097, //13072
13098,13099,13100,13101,13102,13103,13104,13105,13106,13107,13108,13109,13110,13111,13112,13113, //13088
13114,13115,13116,13117,13118,3968,13119,4995,13120,13121,13122,13123,13124,13125,13126,13127, //13104
4505,13128,13129,13130,13131,13132,13133,13134,4996,4506,13135,13136,13137,13138,13139,4997, //13120
13140,13141,13142,13143,13144,13145,13146,13147,13148,13149,13150,13151,13152,13153,13154,13155, //13136
13156,13157,13158,13159,4998,13160,13161,13162,13163,13164,13165,13166,13167,13168,13169,13170, //13152
13171,13172,13173,13174,13175,13176,4999,13177,13178,13179,13180,13181,13182,13183,13184,13185, //13168
13186,13187,13188,13189,13190,13191,13192,13193,13194,13195,13196,13197,13198,13199,13200,13201, //13184
13202,13203,13204,13205,13206,5000,13207,13208,13209,13210,13211,13212,13213,13214,13215,13216, //13200
13217,13218,13219,13220,13221,13222,13223,13224,13225,13226,13227,4200,5001,13228,13229,13230, //13216
13231,13232,13233,13234,13235,13236,13237,13238,13239,13240,3969,13241,13242,13243,13244,3970, //13232
13245,13246,13247,13248,13249,13250,13251,13252,13253,13254,13255,13256,13257,13258,13259,13260, //13248
13261,13262,13263,13264,13265,13266,13267,13268,3450,13269,13270,13271,13272,13273,13274,13275, //13264
13276,5002,13277,13278,13279,13280,13281,13282,13283,13284,13285,13286,13287,13288,13289,13290, //13280
13291,13292,13293,13294,13295,13296,13297,13298,13299,13300,13301,13302,3813,13303,13304,13305, //13296
13306,13307,13308,13309,13310,13311,13312,13313,13314,13315,13316,13317,13318,13319,13320,13321, //13312
13322,13323,13324,13325,13326,13327,13328,4507,13329,13330,13331,13332,13333,13334,13335,13336, //13328
13337,13338,13339,13340,13341,5003,13342,13343,13344,13345,13346,13347,13348,13349,13350,13351, //13344
13352,13353,13354,13355,13356,13357,13358,13359,13360,13361,13362,13363,13364,13365,13366,13367, //13360
5004,13368,13369,13370,13371,13372,13373,13374,13375,13376,13377,13378,13379,13380,13381,13382, //13376
13383,13384,13385,13386,13387,13388,13389,13390,13391,13392,13393,13394,13395,13396,13397,13398, //13392
13399,13400,13401,13402,13403,13404,13405,13406,13407,13408,13409,13410,13411,13412,13413,13414, //13408
13415,13416,13417,13418,13419,13420,13421,13422,13423,13424,13425,13426,13427,13428,13429,13430, //13424
13431,13432,4508,13433,13434,13435,4201,13436,13437,13438,13439,13440,13441,13442,13443,13444, //13440
13445,13446,13447,13448,13449,13450,13451,13452,13453,13454,13455,13456,13457,5005,13458,13459, //13456
13460,13461,13462,13463,13464,13465,13466,13467,13468,13469,13470,4509,13471,13472,13473,13474, //13472
13475,13476,13477,13478,13479,13480,13481,13482,13483,13484,13485,13486,13487,13488,13489,13490, //13488
13491,13492,13493,13494,13495,13496,13497,13498,13499,13500,13501,13502,13503,13504,13505,13506, //13504
13507,13508,13509,13510,13511,13512,13513,13514,13515,13516,13517,13518,13519,13520,13521,13522, //13520
13523,13524,13525,13526,13527,13528,13529,13530,13531,13532,13533,13534,13535,13536,13537,13538, //13536
13539,13540,13541,13542,13543,13544,13545,13546,13547,13548,13549,13550,13551,13552,13553,13554, //13552
13555,13556,13557,13558,13559,13560,13561,13562,13563,13564,13565,13566,13567,13568,13569,13570, //13568
13571,13572,13573,13574,13575,13576,13577,13578,13579,13580,13581,13582,13583,13584,13585,13586, //13584
13587,13588,13589,13590,13591,13592,13593,13594,13595,13596,13597,13598,13599,13600,13601,13602, //13600
13603,13604,13605,13606,13607,13608,13609,13610,13611,13612,13613,13614,13615,13616,13617,13618, //13616
13619,13620,13621,13622,13623,13624,13625,13626,13627,13628,13629,13630,13631,13632,13633,13634, //13632
13635,13636,13637,13638,13639,13640,13641,13642,5006,13643,13644,13645,13646,13647,13648,13649, //13648
13650,13651,5007,13652,13653,13654,13655,13656,13657,13658,13659,13660,13661,13662,13663,13664, //13664
13665,13666,13667,13668,13669,13670,13671,13672,13673,13674,13675,13676,13677,13678,13679,13680, //13680
13681,13682,13683,13684,13685,13686,13687,13688,13689,13690,13691,13692,13693,13694,13695,13696, //13696
13697,13698,13699,13700,13701,13702,13703,13704,13705,13706,13707,13708,13709,13710,13711,13712, //13712
13713,13714,13715,13716,13717,13718,13719,13720,13721,13722,13723,13724,13725,13726,13727,13728, //13728
13729,13730,13731,13732,13733,13734,13735,13736,13737,13738,13739,13740,13741,13742,13743,13744, //13744
13745,13746,13747,13748,13749,13750,13751,13752,13753,13754,13755,13756,13757,13758,13759,13760, //13760
13761,13762,13763,13764,13765,13766,13767,13768,13769,13770,13771,13772,13773,13774,3273,13775, //13776
13776,13777,13778,13779,13780,13781,13782,13783,13784,13785,13786,13787,13788,13789,13790,13791, //13792
13792,13793,13794,13795,13796,13797,13798,13799,13800,13801,13802,13803,13804,13805,13806,13807, //13808
13808,13809,13810,13811,13812,13813,13814,13815,13816,13817,13818,13819,13820,13821,13822,13823, //13824
13824,13825,13826,13827,13828,13829,13830,13831,13832,13833,13834,13835,13836,13837,13838,13839, //13840
13840,13841,13842,13843,13844,13845,13846,13847,13848,13849,13850,13851,13852,13853,13854,13855, //13856
13856,13857,13858,13859,13860,13861,13862,13863,13864,13865,13866,13867,13868,13869,13870,13871, //13872
13872,13873,13874,13875,13876,13877,13878,13879,13880,13881,13882,13883,13884,13885,13886,13887, //13888
13888,13889,13890,13891,13892,13893,13894,13895,13896,13897,13898,13899,13900,13901,13902,13903, //13904
13904,13905,13906,13907,13908,13909,13910,13911,13912,13913,13914,13915,13916,13917,13918,13919, //13920
13920,13921,13922,13923,13924,13925,13926,13927,13928,13929,13930,13931,13932,13933,13934,13935, //13936
13936,13937,13938,13939,13940,13941,13942,13943,13944,13945,13946,13947,13948,13949,13950,13951, //13952
13952,13953,13954,13955,13956,13957,13958,13959,13960,13961,13962,13963,13964,13965,13966,13967, //13968
13968,13969,13970,13971,13972]; //13973

/*
 * The Original Code is Mozilla Universal charset detector code.
 *
 * The Initial Developer of the Original Code is
 * Netscape Communications Corporation.
 * Portions created by the Initial Developer are Copyright (C) 2001
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   António Afonso (antonio.afonso gmail.com) - port to JavaScript
 *   Mark Pilgrim - port to Python
 *   Shy Shalom - original C code
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301  USA
 */

// EUCTW frequency table
// Converted from big5 work
// by Taiwan's Mandarin Promotion Council
// <http://www.edu.tw:81/mandr/>

// 128  --> 0.42261
// 256  --> 0.57851
// 512  --> 0.74851
// 1024 --> 0.89384
// 2048 --> 0.97583
//
// Idea Distribution Ratio = 0.74851/(1-0.74851) =2.98
// Random Distribution Ration = 512/(5401-512)=0.105
//
// Typical Distribution Ratio about 25% of Ideal one, still much higher than RDR

jschardet.EUCTW_TYPICAL_DISTRIBUTION_RATIO = 0.75;

// Char to FreqOrder table ,
jschardet.EUCTW_TABLE_SIZE = 8102;

jschardet.EUCTWCharToFreqOrder = [
   1,1800,1506, 255,1431, 198,   9,  82,   6,7310, 177, 202,3615,1256,2808, 110, // 2742
3735,  33,3241, 261,  76,  44,2113,  16,2931,2184,1176, 659,3868,  26,3404,2643, // 2758
1198,3869,3313,4060, 410,2211, 302, 590, 361,1963,   8, 204,  58,4296,7311,1931, // 2774
  63,7312,7313, 317,1614,  75, 222, 159,4061,2412,1480,7314,3500,3068, 224,2809, // 2790
3616,   3,  10,3870,1471,  29,2774,1135,2852,1939, 873, 130,3242,1123, 312,7315, // 2806
4297,2051, 507, 252, 682,7316, 142,1914, 124, 206,2932,  34,3501,3173,  64, 604, // 2822
7317,2494,1976,1977, 155,1990, 645, 641,1606,7318,3405, 337,  72, 406,7319,  80, // 2838
 630, 238,3174,1509, 263, 939,1092,2644, 756,1440,1094,3406, 449,  69,2969, 591, // 2854
 179,2095, 471, 115,2034,1843,  60,  50,2970, 134, 806,1868, 734,2035,3407, 180, // 2870
 995,1607, 156, 537,2893, 688,7320, 319,1305, 779,2144, 514,2374, 298,4298, 359, // 2886
2495,  90,2707,1338, 663,  11, 906,1099,2545,  20,2436, 182, 532,1716,7321, 732, // 2902
1376,4062,1311,1420,3175,  25,2312,1056, 113, 399, 382,1949, 242,3408,2467, 529, // 2918
3243, 475,1447,3617,7322, 117,  21, 656, 810,1297,2295,2329,3502,7323, 126,4063, // 2934
 706, 456, 150, 613,4299,  71,1118,2036,4064, 145,3069,  85, 835, 486,2114,1246, // 2950
1426, 428, 727,1285,1015, 800, 106, 623, 303,1281,7324,2127,2354, 347,3736, 221, // 2966
3503,3110,7325,1955,1153,4065,  83, 296,1199,3070, 192, 624,  93,7326, 822,1897, // 2982
2810,3111, 795,2064, 991,1554,1542,1592,  27,  43,2853, 859, 139,1456, 860,4300, // 2998
 437, 712,3871, 164,2392,3112, 695, 211,3017,2096, 195,3872,1608,3504,3505,3618, // 3014
3873, 234, 811,2971,2097,3874,2229,1441,3506,1615,2375, 668,2076,1638, 305, 228, // 3030
1664,4301, 467, 415,7327, 262,2098,1593, 239, 108, 300, 200,1033, 512,1247,2077, // 3046
7328,7329,2173,3176,3619,2673, 593, 845,1062,3244,  88,1723,2037,3875,1950, 212, // 3062
 266, 152, 149, 468,1898,4066,4302,  77, 187,7330,3018,  37,   5,2972,7331,3876, // 3078
7332,7333,  39,2517,4303,2894,3177,2078,  55, 148,  74,4304, 545, 483,1474,1029, // 3094
1665, 217,1869,1531,3113,1104,2645,4067,  24, 172,3507, 900,3877,3508,3509,4305, // 3110
  32,1408,2811,1312, 329, 487,2355,2247,2708, 784,2674,   4,3019,3314,1427,1788, // 3126
 188, 109, 499,7334,3620,1717,1789, 888,1217,3020,4306,7335,3510,7336,3315,1520, // 3142
3621,3878, 196,1034, 775,7337,7338, 929,1815, 249, 439,  38,7339,1063,7340, 794, // 3158
3879,1435,2296,  46, 178,3245,2065,7341,2376,7342, 214,1709,4307, 804,  35, 707, // 3174
 324,3622,1601,2546, 140, 459,4068,7343,7344,1365, 839, 272, 978,2257,2572,3409, // 3190
2128,1363,3623,1423, 697, 100,3071,  48,  70,1231, 495,3114,2193,7345,1294,7346, // 3206
2079, 462, 586,1042,3246, 853, 256, 988, 185,2377,3410,1698, 434,1084,7347,3411, // 3222
 314,2615,2775,4308,2330,2331, 569,2280, 637,1816,2518, 757,1162,1878,1616,3412, // 3238
 287,1577,2115, 768,4309,1671,2854,3511,2519,1321,3737, 909,2413,7348,4069, 933, // 3254
3738,7349,2052,2356,1222,4310, 765,2414,1322, 786,4311,7350,1919,1462,1677,2895, // 3270
1699,7351,4312,1424,2437,3115,3624,2590,3316,1774,1940,3413,3880,4070, 309,1369, // 3286
1130,2812, 364,2230,1653,1299,3881,3512,3882,3883,2646, 525,1085,3021, 902,2000, // 3302
1475, 964,4313, 421,1844,1415,1057,2281, 940,1364,3116, 376,4314,4315,1381,   7, // 3318
2520, 983,2378, 336,1710,2675,1845, 321,3414, 559,1131,3022,2742,1808,1132,1313, // 3334
 265,1481,1857,7352, 352,1203,2813,3247, 167,1089, 420,2814, 776, 792,1724,3513, // 3350
4071,2438,3248,7353,4072,7354, 446, 229, 333,2743, 901,3739,1200,1557,4316,2647, // 3366
1920, 395,2744,2676,3740,4073,1835, 125, 916,3178,2616,4317,7355,7356,3741,7357, // 3382
7358,7359,4318,3117,3625,1133,2547,1757,3415,1510,2313,1409,3514,7360,2145, 438, // 3398
2591,2896,2379,3317,1068, 958,3023, 461, 311,2855,2677,4074,1915,3179,4075,1978, // 3414
 383, 750,2745,2617,4076, 274, 539, 385,1278,1442,7361,1154,1964, 384, 561, 210, // 3430
  98,1295,2548,3515,7362,1711,2415,1482,3416,3884,2897,1257, 129,7363,3742, 642, // 3446
 523,2776,2777,2648,7364, 141,2231,1333,  68, 176, 441, 876, 907,4077, 603,2592, // 3462
 710, 171,3417, 404, 549,  18,3118,2393,1410,3626,1666,7365,3516,4319,2898,4320, // 3478
7366,2973, 368,7367, 146, 366,  99, 871,3627,1543, 748, 807,1586,1185,  22,2258, // 3494
 379,3743,3180,7368,3181, 505,1941,2618,1991,1382,2314,7369, 380,2357, 218, 702, // 3510
1817,1248,3418,3024,3517,3318,3249,7370,2974,3628, 930,3250,3744,7371,  59,7372, // 3526
 585, 601,4078, 497,3419,1112,1314,4321,1801,7373,1223,1472,2174,7374, 749,1836, // 3542
 690,1899,3745,1772,3885,1476, 429,1043,1790,2232,2116, 917,4079, 447,1086,1629, // 3558
7375, 556,7376,7377,2020,1654, 844,1090, 105, 550, 966,1758,2815,1008,1782, 686, // 3574
1095,7378,2282, 793,1602,7379,3518,2593,4322,4080,2933,2297,4323,3746, 980,2496, // 3590
 544, 353, 527,4324, 908,2678,2899,7380, 381,2619,1942,1348,7381,1341,1252, 560, // 3606
3072,7382,3420,2856,7383,2053, 973, 886,2080, 143,4325,7384,7385, 157,3886, 496, // 3622
4081,  57, 840, 540,2038,4326,4327,3421,2117,1445, 970,2259,1748,1965,2081,4082, // 3638
3119,1234,1775,3251,2816,3629, 773,1206,2129,1066,2039,1326,3887,1738,1725,4083, // 3654
 279,3120,  51,1544,2594, 423,1578,2130,2066, 173,4328,1879,7386,7387,1583, 264, // 3670
 610,3630,4329,2439, 280, 154,7388,7389,7390,1739, 338,1282,3073, 693,2857,1411, // 3686
1074,3747,2440,7391,4330,7392,7393,1240, 952,2394,7394,2900,1538,2679, 685,1483, // 3702
4084,2468,1436, 953,4085,2054,4331, 671,2395,  79,4086,2441,3252, 608, 567,2680, // 3718
3422,4087,4088,1691, 393,1261,1791,2396,7395,4332,7396,7397,7398,7399,1383,1672, // 3734
3748,3182,1464, 522,1119, 661,1150, 216, 675,4333,3888,1432,3519, 609,4334,2681, // 3750
2397,7400,7401,7402,4089,3025,   0,7403,2469, 315, 231,2442, 301,3319,4335,2380, // 3766
7404, 233,4090,3631,1818,4336,4337,7405,  96,1776,1315,2082,7406, 257,7407,1809, // 3782
3632,2709,1139,1819,4091,2021,1124,2163,2778,1777,2649,7408,3074, 363,1655,3183, // 3798
7409,2975,7410,7411,7412,3889,1567,3890, 718, 103,3184, 849,1443, 341,3320,2934, // 3814
1484,7413,1712, 127,  67, 339,4092,2398, 679,1412, 821,7414,7415, 834, 738, 351, // 3830
2976,2146, 846, 235,1497,1880, 418,1992,3749,2710, 186,1100,2147,2746,3520,1545, // 3846
1355,2935,2858,1377, 583,3891,4093,2573,2977,7416,1298,3633,1078,2549,3634,2358, // 3862
  78,3750,3751, 267,1289,2099,2001,1594,4094, 348, 369,1274,2194,2175,1837,4338, // 3878
1820,2817,3635,2747,2283,2002,4339,2936,2748, 144,3321, 882,4340,3892,2749,3423, // 3894
4341,2901,7417,4095,1726, 320,7418,3893,3026, 788,2978,7419,2818,1773,1327,2859, // 3910
3894,2819,7420,1306,4342,2003,1700,3752,3521,2359,2650, 787,2022, 506, 824,3636, // 3926
 534, 323,4343,1044,3322,2023,1900, 946,3424,7421,1778,1500,1678,7422,1881,4344, // 3942
 165, 243,4345,3637,2521, 123, 683,4096, 764,4346,  36,3895,1792, 589,2902, 816, // 3958
 626,1667,3027,2233,1639,1555,1622,3753,3896,7423,3897,2860,1370,1228,1932, 891, // 3974
2083,2903, 304,4097,7424, 292,2979,2711,3522, 691,2100,4098,1115,4347, 118, 662, // 3990
7425, 611,1156, 854,2381,1316,2861,   2, 386, 515,2904,7426,7427,3253, 868,2234, // 4006
1486, 855,2651, 785,2212,3028,7428,1040,3185,3523,7429,3121, 448,7430,1525,7431, // 4022
2164,4348,7432,3754,7433,4099,2820,3524,3122, 503, 818,3898,3123,1568, 814, 676, // 4038
1444, 306,1749,7434,3755,1416,1030, 197,1428, 805,2821,1501,4349,7435,7436,7437, // 4054
1993,7438,4350,7439,7440,2195,  13,2779,3638,2980,3124,1229,1916,7441,3756,2131, // 4070
7442,4100,4351,2399,3525,7443,2213,1511,1727,1120,7444,7445, 646,3757,2443, 307, // 4086
7446,7447,1595,3186,7448,7449,7450,3639,1113,1356,3899,1465,2522,2523,7451, 519, // 4102
7452, 128,2132,  92,2284,1979,7453,3900,1512, 342,3125,2196,7454,2780,2214,1980, // 4118
3323,7455, 290,1656,1317, 789, 827,2360,7456,3758,4352, 562, 581,3901,7457, 401, // 4134
4353,2248,  94,4354,1399,2781,7458,1463,2024,4355,3187,1943,7459, 828,1105,4101, // 4150
1262,1394,7460,4102, 605,4356,7461,1783,2862,7462,2822, 819,2101, 578,2197,2937, // 4166
7463,1502, 436,3254,4103,3255,2823,3902,2905,3425,3426,7464,2712,2315,7465,7466, // 4182
2332,2067,  23,4357, 193, 826,3759,2102, 699,1630,4104,3075, 390,1793,1064,3526, // 4198
7467,1579,3076,3077,1400,7468,4105,1838,1640,2863,7469,4358,4359, 137,4106, 598, // 4214
3078,1966, 780, 104, 974,2938,7470, 278, 899, 253, 402, 572, 504, 493,1339,7471, // 4230
3903,1275,4360,2574,2550,7472,3640,3029,3079,2249, 565,1334,2713, 863,  41,7473, // 4246
7474,4361,7475,1657,2333,  19, 463,2750,4107, 606,7476,2981,3256,1087,2084,1323, // 4262
2652,2982,7477,1631,1623,1750,4108,2682,7478,2864, 791,2714,2653,2334, 232,2416, // 4278
7479,2983,1498,7480,2654,2620, 755,1366,3641,3257,3126,2025,1609, 119,1917,3427, // 4294
 862,1026,4109,7481,3904,3760,4362,3905,4363,2260,1951,2470,7482,1125, 817,4110, // 4310
4111,3906,1513,1766,2040,1487,4112,3030,3258,2824,3761,3127,7483,7484,1507,7485, // 4326
2683, 733,  40,1632,1106,2865, 345,4113, 841,2524, 230,4364,2984,1846,3259,3428, // 4342
7486,1263, 986,3429,7487, 735, 879, 254,1137, 857, 622,1300,1180,1388,1562,3907, // 4358
3908,2939, 967,2751,2655,1349, 592,2133,1692,3324,2985,1994,4114,1679,3909,1901, // 4374
2185,7488, 739,3642,2715,1296,1290,7489,4115,2198,2199,1921,1563,2595,2551,1870, // 4390
2752,2986,7490, 435,7491, 343,1108, 596,  17,1751,4365,2235,3430,3643,7492,4366, // 4406
 294,3527,2940,1693, 477, 979, 281,2041,3528, 643,2042,3644,2621,2782,2261,1031, // 4422
2335,2134,2298,3529,4367, 367,1249,2552,7493,3530,7494,4368,1283,3325,2004, 240, // 4438
1762,3326,4369,4370, 836,1069,3128, 474,7495,2148,2525, 268,3531,7496,3188,1521, // 4454
1284,7497,1658,1546,4116,7498,3532,3533,7499,4117,3327,2684,1685,4118, 961,1673, // 4470
2622, 190,2005,2200,3762,4371,4372,7500, 570,2497,3645,1490,7501,4373,2623,3260, // 4486
1956,4374, 584,1514, 396,1045,1944,7502,4375,1967,2444,7503,7504,4376,3910, 619, // 4502
7505,3129,3261, 215,2006,2783,2553,3189,4377,3190,4378, 763,4119,3763,4379,7506, // 4518
7507,1957,1767,2941,3328,3646,1174, 452,1477,4380,3329,3130,7508,2825,1253,2382, // 4534
2186,1091,2285,4120, 492,7509, 638,1169,1824,2135,1752,3911, 648, 926,1021,1324, // 4550
4381, 520,4382, 997, 847,1007, 892,4383,3764,2262,1871,3647,7510,2400,1784,4384, // 4566
1952,2942,3080,3191,1728,4121,2043,3648,4385,2007,1701,3131,1551,  30,2263,4122, // 4582
7511,2026,4386,3534,7512, 501,7513,4123, 594,3431,2165,1821,3535,3432,3536,3192, // 4598
 829,2826,4124,7514,1680,3132,1225,4125,7515,3262,4387,4126,3133,2336,7516,4388, // 4614
4127,7517,3912,3913,7518,1847,2383,2596,3330,7519,4389, 374,3914, 652,4128,4129, // 4630
 375,1140, 798,7520,7521,7522,2361,4390,2264, 546,1659, 138,3031,2445,4391,7523, // 4646
2250, 612,1848, 910, 796,3765,1740,1371, 825,3766,3767,7524,2906,2554,7525, 692, // 4662
 444,3032,2624, 801,4392,4130,7526,1491, 244,1053,3033,4131,4132, 340,7527,3915, // 4678
1041,2987, 293,1168,  87,1357,7528,1539, 959,7529,2236, 721, 694,4133,3768, 219, // 4694
1478, 644,1417,3331,2656,1413,1401,1335,1389,3916,7530,7531,2988,2362,3134,1825, // 4710
 730,1515, 184,2827,  66,4393,7532,1660,2943, 246,3332, 378,1457, 226,3433, 975, // 4726
3917,2944,1264,3537, 674, 696,7533, 163,7534,1141,2417,2166, 713,3538,3333,4394, // 4742
3918,7535,7536,1186,  15,7537,1079,1070,7538,1522,3193,3539, 276,1050,2716, 758, // 4758
1126, 653,2945,3263,7539,2337, 889,3540,3919,3081,2989, 903,1250,4395,3920,3434, // 4774
3541,1342,1681,1718, 766,3264, 286,  89,2946,3649,7540,1713,7541,2597,3334,2990, // 4790
7542,2947,2215,3194,2866,7543,4396,2498,2526, 181, 387,1075,3921, 731,2187,3335, // 4806
7544,3265, 310, 313,3435,2299, 770,4134,  54,3034, 189,4397,3082,3769,3922,7545, // 4822
1230,1617,1849, 355,3542,4135,4398,3336, 111,4136,3650,1350,3135,3436,3035,4137, // 4838
2149,3266,3543,7546,2784,3923,3924,2991, 722,2008,7547,1071, 247,1207,2338,2471, // 4854
1378,4399,2009, 864,1437,1214,4400, 373,3770,1142,2216, 667,4401, 442,2753,2555, // 4870
3771,3925,1968,4138,3267,1839, 837, 170,1107, 934,1336,1882,7548,7549,2118,4139, // 4886
2828, 743,1569,7550,4402,4140, 582,2384,1418,3437,7551,1802,7552, 357,1395,1729, // 4902
3651,3268,2418,1564,2237,7553,3083,3772,1633,4403,1114,2085,4141,1532,7554, 482, // 4918
2446,4404,7555,7556,1492, 833,1466,7557,2717,3544,1641,2829,7558,1526,1272,3652, // 4934
4142,1686,1794, 416,2556,1902,1953,1803,7559,3773,2785,3774,1159,2316,7560,2867, // 4950
4405,1610,1584,3036,2419,2754, 443,3269,1163,3136,7561,7562,3926,7563,4143,2499, // 4966
3037,4406,3927,3137,2103,1647,3545,2010,1872,4144,7564,4145, 431,3438,7565, 250, // 4982
  97,  81,4146,7566,1648,1850,1558, 160, 848,7567, 866, 740,1694,7568,2201,2830, // 4998
3195,4147,4407,3653,1687, 950,2472, 426, 469,3196,3654,3655,3928,7569,7570,1188, // 5014
 424,1995, 861,3546,4148,3775,2202,2685, 168,1235,3547,4149,7571,2086,1674,4408, // 5030
3337,3270, 220,2557,1009,7572,3776, 670,2992, 332,1208, 717,7573,7574,3548,2447, // 5046
3929,3338,7575, 513,7576,1209,2868,3339,3138,4409,1080,7577,7578,7579,7580,2527, // 5062
3656,3549, 815,1587,3930,3931,7581,3550,3439,3777,1254,4410,1328,3038,1390,3932, // 5078
1741,3933,3778,3934,7582, 236,3779,2448,3271,7583,7584,3657,3780,1273,3781,4411, // 5094
7585, 308,7586,4412, 245,4413,1851,2473,1307,2575, 430, 715,2136,2449,7587, 270, // 5110
 199,2869,3935,7588,3551,2718,1753, 761,1754, 725,1661,1840,4414,3440,3658,7589, // 5126
7590, 587,  14,3272, 227,2598, 326, 480,2265, 943,2755,3552, 291, 650,1883,7591, // 5142
1702,1226, 102,1547,  62,3441, 904,4415,3442,1164,4150,7592,7593,1224,1548,2756, // 5158
 391, 498,1493,7594,1386,1419,7595,2055,1177,4416, 813, 880,1081,2363, 566,1145, // 5174
4417,2286,1001,1035,2558,2599,2238, 394,1286,7596,7597,2068,7598,  86,1494,1730, // 5190
3936, 491,1588, 745, 897,2948, 843,3340,3937,2757,2870,3273,1768, 998,2217,2069, // 5206
 397,1826,1195,1969,3659,2993,3341, 284,7599,3782,2500,2137,2119,1903,7600,3938, // 5222
2150,3939,4151,1036,3443,1904, 114,2559,4152, 209,1527,7601,7602,2949,2831,2625, // 5238
2385,2719,3139, 812,2560,7603,3274,7604,1559, 737,1884,3660,1210, 885,  28,2686, // 5254
3553,3783,7605,4153,1004,1779,4418,7606, 346,1981,2218,2687,4419,3784,1742, 797, // 5270
1642,3940,1933,1072,1384,2151, 896,3941,3275,3661,3197,2871,3554,7607,2561,1958, // 5286
4420,2450,1785,7608,7609,7610,3942,4154,1005,1308,3662,4155,2720,4421,4422,1528, // 5302
2600, 161,1178,4156,1982, 987,4423,1101,4157, 631,3943,1157,3198,2420,1343,1241, // 5318
1016,2239,2562, 372, 877,2339,2501,1160, 555,1934, 911,3944,7611, 466,1170, 169, // 5334
1051,2907,2688,3663,2474,2994,1182,2011,2563,1251,2626,7612, 992,2340,3444,1540, // 5350
2721,1201,2070,2401,1996,2475,7613,4424, 528,1922,2188,1503,1873,1570,2364,3342, // 5366
3276,7614, 557,1073,7615,1827,3445,2087,2266,3140,3039,3084, 767,3085,2786,4425, // 5382
1006,4158,4426,2341,1267,2176,3664,3199, 778,3945,3200,2722,1597,2657,7616,4427, // 5398
7617,3446,7618,7619,7620,3277,2689,1433,3278, 131,  95,1504,3946, 723,4159,3141, // 5414
1841,3555,2758,2189,3947,2027,2104,3665,7621,2995,3948,1218,7622,3343,3201,3949, // 5430
4160,2576, 248,1634,3785, 912,7623,2832,3666,3040,3786, 654,  53,7624,2996,7625, // 5446
1688,4428, 777,3447,1032,3950,1425,7626, 191, 820,2120,2833, 971,4429, 931,3202, // 5462
 135, 664, 783,3787,1997, 772,2908,1935,3951,3788,4430,2909,3203, 282,2723, 640, // 5478
1372,3448,1127, 922, 325,3344,7627,7628, 711,2044,7629,7630,3952,2219,2787,1936, // 5494
3953,3345,2220,2251,3789,2300,7631,4431,3790,1258,3279,3954,3204,2138,2950,3955, // 5510
3956,7632,2221, 258,3205,4432, 101,1227,7633,3280,1755,7634,1391,3281,7635,2910, // 5526
2056, 893,7636,7637,7638,1402,4161,2342,7639,7640,3206,3556,7641,7642, 878,1325, // 5542
1780,2788,4433, 259,1385,2577, 744,1183,2267,4434,7643,3957,2502,7644, 684,1024, // 5558
4162,7645, 472,3557,3449,1165,3282,3958,3959, 322,2152, 881, 455,1695,1152,1340, // 5574
 660, 554,2153,4435,1058,4436,4163, 830,1065,3346,3960,4437,1923,7646,1703,1918, // 5590
7647, 932,2268, 122,7648,4438, 947, 677,7649,3791,2627, 297,1905,1924,2269,4439, // 5606
2317,3283,7650,7651,4164,7652,4165,  84,4166, 112, 989,7653, 547,1059,3961, 701, // 5622
3558,1019,7654,4167,7655,3450, 942, 639, 457,2301,2451, 993,2951, 407, 851, 494, // 5638
4440,3347, 927,7656,1237,7657,2421,3348, 573,4168, 680, 921,2911,1279,1874, 285, // 5654
 790,1448,1983, 719,2167,7658,7659,4441,3962,3963,1649,7660,1541, 563,7661,1077, // 5670
7662,3349,3041,3451, 511,2997,3964,3965,3667,3966,1268,2564,3350,3207,4442,4443, // 5686
7663, 535,1048,1276,1189,2912,2028,3142,1438,1373,2834,2952,1134,2012,7664,4169, // 5702
1238,2578,3086,1259,7665, 700,7666,2953,3143,3668,4170,7667,4171,1146,1875,1906, // 5718
4444,2601,3967, 781,2422, 132,1589, 203, 147, 273,2789,2402, 898,1786,2154,3968, // 5734
3969,7668,3792,2790,7669,7670,4445,4446,7671,3208,7672,1635,3793, 965,7673,1804, // 5750
2690,1516,3559,1121,1082,1329,3284,3970,1449,3794,  65,1128,2835,2913,2759,1590, // 5766
3795,7674,7675,  12,2658,  45, 976,2579,3144,4447, 517,2528,1013,1037,3209,7676, // 5782
3796,2836,7677,3797,7678,3452,7679,2602, 614,1998,2318,3798,3087,2724,2628,7680, // 5798
2580,4172, 599,1269,7681,1810,3669,7682,2691,3088, 759,1060, 489,1805,3351,3285, // 5814
1358,7683,7684,2386,1387,1215,2629,2252, 490,7685,7686,4173,1759,2387,2343,7687, // 5830
4448,3799,1907,3971,2630,1806,3210,4449,3453,3286,2760,2344, 874,7688,7689,3454, // 5846
3670,1858,  91,2914,3671,3042,3800,4450,7690,3145,3972,2659,7691,3455,1202,1403, // 5862
3801,2954,2529,1517,2503,4451,3456,2504,7692,4452,7693,2692,1885,1495,1731,3973, // 5878
2365,4453,7694,2029,7695,7696,3974,2693,1216, 237,2581,4174,2319,3975,3802,4454, // 5894
4455,2694,3560,3457, 445,4456,7697,7698,7699,7700,2761,  61,3976,3672,1822,3977, // 5910
7701, 687,2045, 935, 925, 405,2660, 703,1096,1859,2725,4457,3978,1876,1367,2695, // 5926
3352, 918,2105,1781,2476, 334,3287,1611,1093,4458, 564,3146,3458,3673,3353, 945, // 5942
2631,2057,4459,7702,1925, 872,4175,7703,3459,2696,3089, 349,4176,3674,3979,4460, // 5958
3803,4177,3675,2155,3980,4461,4462,4178,4463,2403,2046, 782,3981, 400, 251,4179, // 5974
1624,7704,7705, 277,3676, 299,1265, 476,1191,3804,2121,4180,4181,1109, 205,7706, // 5990
2582,1000,2156,3561,1860,7707,7708,7709,4464,7710,4465,2565, 107,2477,2157,3982, // 6006
3460,3147,7711,1533, 541,1301, 158, 753,4182,2872,3562,7712,1696, 370,1088,4183, // 6022
4466,3563, 579, 327, 440, 162,2240, 269,1937,1374,3461, 968,3043,  56,1396,3090, // 6038
2106,3288,3354,7713,1926,2158,4467,2998,7714,3564,7715,7716,3677,4468,2478,7717, // 6054
2791,7718,1650,4469,7719,2603,7720,7721,3983,2661,3355,1149,3356,3984,3805,3985, // 6070
7722,1076,  49,7723, 951,3211,3289,3290, 450,2837, 920,7724,1811,2792,2366,4184, // 6086
1908,1138,2367,3806,3462,7725,3212,4470,1909,1147,1518,2423,4471,3807,7726,4472, // 6102
2388,2604, 260,1795,3213,7727,7728,3808,3291, 708,7729,3565,1704,7730,3566,1351, // 6118
1618,3357,2999,1886, 944,4185,3358,4186,3044,3359,4187,7731,3678, 422, 413,1714, // 6134
3292, 500,2058,2345,4188,2479,7732,1344,1910, 954,7733,1668,7734,7735,3986,2404, // 6150
4189,3567,3809,4190,7736,2302,1318,2505,3091, 133,3092,2873,4473, 629,  31,2838, // 6166
2697,3810,4474, 850, 949,4475,3987,2955,1732,2088,4191,1496,1852,7737,3988, 620, // 6182
3214, 981,1242,3679,3360,1619,3680,1643,3293,2139,2452,1970,1719,3463,2168,7738, // 6198
3215,7739,7740,3361,1828,7741,1277,4476,1565,2047,7742,1636,3568,3093,7743, 869, // 6214
2839, 655,3811,3812,3094,3989,3000,3813,1310,3569,4477,7744,7745,7746,1733, 558, // 6230
4478,3681, 335,1549,3045,1756,4192,3682,1945,3464,1829,1291,1192, 470,2726,2107, // 6246
2793, 913,1054,3990,7747,1027,7748,3046,3991,4479, 982,2662,3362,3148,3465,3216, // 6262
3217,1946,2794,7749, 571,4480,7750,1830,7751,3570,2583,1523,2424,7752,2089, 984, // 6278
4481,3683,1959,7753,3684, 852, 923,2795,3466,3685, 969,1519, 999,2048,2320,1705, // 6294
7754,3095, 615,1662, 151, 597,3992,2405,2321,1049, 275,4482,3686,4193, 568,3687, // 6310
3571,2480,4194,3688,7755,2425,2270, 409,3218,7756,1566,2874,3467,1002, 769,2840, // 6326
 194,2090,3149,3689,2222,3294,4195, 628,1505,7757,7758,1763,2177,3001,3993, 521, // 6342
1161,2584,1787,2203,2406,4483,3994,1625,4196,4197, 412,  42,3096, 464,7759,2632, // 6358
4484,3363,1760,1571,2875,3468,2530,1219,2204,3814,2633,2140,2368,4485,4486,3295, // 6374
1651,3364,3572,7760,7761,3573,2481,3469,7762,3690,7763,7764,2271,2091, 460,7765, // 6390
4487,7766,3002, 962, 588,3574, 289,3219,2634,1116,  52,7767,3047,1796,7768,7769, // 6406
7770,1467,7771,1598,1143,3691,4198,1984,1734,1067,4488,1280,3365, 465,4489,1572, // 6422
 510,7772,1927,2241,1812,1644,3575,7773,4490,3692,7774,7775,2663,1573,1534,7776, // 6438
7777,4199, 536,1807,1761,3470,3815,3150,2635,7778,7779,7780,4491,3471,2915,1911, // 6454
2796,7781,3296,1122, 377,3220,7782, 360,7783,7784,4200,1529, 551,7785,2059,3693, // 6470
1769,2426,7786,2916,4201,3297,3097,2322,2108,2030,4492,1404, 136,1468,1479, 672, // 6486
1171,3221,2303, 271,3151,7787,2762,7788,2049, 678,2727, 865,1947,4493,7789,2013, // 6502
3995,2956,7790,2728,2223,1397,3048,3694,4494,4495,1735,2917,3366,3576,7791,3816, // 6518
 509,2841,2453,2876,3817,7792,7793,3152,3153,4496,4202,2531,4497,2304,1166,1010, // 6534
 552, 681,1887,7794,7795,2957,2958,3996,1287,1596,1861,3154, 358, 453, 736, 175, // 6550
 478,1117, 905,1167,1097,7796,1853,1530,7797,1706,7798,2178,3472,2287,3695,3473, // 6566
3577,4203,2092,4204,7799,3367,1193,2482,4205,1458,2190,2205,1862,1888,1421,3298, // 6582
2918,3049,2179,3474, 595,2122,7800,3997,7801,7802,4206,1707,2636, 223,3696,1359, // 6598
 751,3098, 183,3475,7803,2797,3003, 419,2369, 633, 704,3818,2389, 241,7804,7805, // 6614
7806, 838,3004,3697,2272,2763,2454,3819,1938,2050,3998,1309,3099,2242,1181,7807, // 6630
1136,2206,3820,2370,1446,4207,2305,4498,7808,7809,4208,1055,2605, 484,3698,7810, // 6646
3999, 625,4209,2273,3368,1499,4210,4000,7811,4001,4211,3222,2274,2275,3476,7812, // 6662
7813,2764, 808,2606,3699,3369,4002,4212,3100,2532, 526,3370,3821,4213, 955,7814, // 6678
1620,4214,2637,2427,7815,1429,3700,1669,1831, 994, 928,7816,3578,1260,7817,7818, // 6694
7819,1948,2288, 741,2919,1626,4215,2729,2455, 867,1184, 362,3371,1392,7820,7821, // 6710
4003,4216,1770,1736,3223,2920,4499,4500,1928,2698,1459,1158,7822,3050,3372,2877, // 6726
1292,1929,2506,2842,3701,1985,1187,2071,2014,2607,4217,7823,2566,2507,2169,3702, // 6742
2483,3299,7824,3703,4501,7825,7826, 666,1003,3005,1022,3579,4218,7827,4502,1813, // 6758
2253, 574,3822,1603, 295,1535, 705,3823,4219, 283, 858, 417,7828,7829,3224,4503, // 6774
4504,3051,1220,1889,1046,2276,2456,4004,1393,1599, 689,2567, 388,4220,7830,2484, // 6790
 802,7831,2798,3824,2060,1405,2254,7832,4505,3825,2109,1052,1345,3225,1585,7833, // 6806
 809,7834,7835,7836, 575,2730,3477, 956,1552,1469,1144,2323,7837,2324,1560,2457, // 6822
3580,3226,4005, 616,2207,3155,2180,2289,7838,1832,7839,3478,4506,7840,1319,3704, // 6838
3705,1211,3581,1023,3227,1293,2799,7841,7842,7843,3826, 607,2306,3827, 762,2878, // 6854
1439,4221,1360,7844,1485,3052,7845,4507,1038,4222,1450,2061,2638,4223,1379,4508, // 6870
2585,7846,7847,4224,1352,1414,2325,2921,1172,7848,7849,3828,3829,7850,1797,1451, // 6886
7851,7852,7853,7854,2922,4006,4007,2485,2346, 411,4008,4009,3582,3300,3101,4509, // 6902
1561,2664,1452,4010,1375,7855,7856,  47,2959, 316,7857,1406,1591,2923,3156,7858, // 6918
1025,2141,3102,3157, 354,2731, 884,2224,4225,2407, 508,3706, 726,3583, 996,2428, // 6934
3584, 729,7859, 392,2191,1453,4011,4510,3707,7860,7861,2458,3585,2608,1675,2800, // 6950
 919,2347,2960,2348,1270,4511,4012,  73,7862,7863, 647,7864,3228,2843,2255,1550, // 6966
1346,3006,7865,1332, 883,3479,7866,7867,7868,7869,3301,2765,7870,1212, 831,1347, // 6982
4226,4512,2326,3830,1863,3053, 720,3831,4513,4514,3832,7871,4227,7872,7873,4515, // 6998
7874,7875,1798,4516,3708,2609,4517,3586,1645,2371,7876,7877,2924, 669,2208,2665, // 7014
2429,7878,2879,7879,7880,1028,3229,7881,4228,2408,7882,2256,1353,7883,7884,4518, // 7030
3158, 518,7885,4013,7886,4229,1960,7887,2142,4230,7888,7889,3007,2349,2350,3833, // 7046
 516,1833,1454,4014,2699,4231,4519,2225,2610,1971,1129,3587,7890,2766,7891,2961, // 7062
1422, 577,1470,3008,1524,3373,7892,7893, 432,4232,3054,3480,7894,2586,1455,2508, // 7078
2226,1972,1175,7895,1020,2732,4015,3481,4520,7896,2733,7897,1743,1361,3055,3482, // 7094
2639,4016,4233,4521,2290, 895, 924,4234,2170, 331,2243,3056, 166,1627,3057,1098, // 7110
7898,1232,2880,2227,3374,4522, 657, 403,1196,2372, 542,3709,3375,1600,4235,3483, // 7126
7899,4523,2767,3230, 576, 530,1362,7900,4524,2533,2666,3710,4017,7901, 842,3834, // 7142
7902,2801,2031,1014,4018, 213,2700,3376, 665, 621,4236,7903,3711,2925,2430,7904, // 7158
2431,3302,3588,3377,7905,4237,2534,4238,4525,3589,1682,4239,3484,1380,7906, 724, // 7174
2277, 600,1670,7907,1337,1233,4526,3103,2244,7908,1621,4527,7909, 651,4240,7910, // 7190
1612,4241,2611,7911,2844,7912,2734,2307,3058,7913, 716,2459,3059, 174,1255,2701, // 7206
4019,3590, 548,1320,1398, 728,4020,1574,7914,1890,1197,3060,4021,7915,3061,3062, // 7222
3712,3591,3713, 747,7916, 635,4242,4528,7917,7918,7919,4243,7920,7921,4529,7922, // 7238
3378,4530,2432, 451,7923,3714,2535,2072,4244,2735,4245,4022,7924,1764,4531,7925, // 7254
4246, 350,7926,2278,2390,2486,7927,4247,4023,2245,1434,4024, 488,4532, 458,4248, // 7270
4025,3715, 771,1330,2391,3835,2568,3159,2159,2409,1553,2667,3160,4249,7928,2487, // 7286
2881,2612,1720,2702,4250,3379,4533,7929,2536,4251,7930,3231,4252,2768,7931,2015, // 7302
2736,7932,1155,1017,3716,3836,7933,3303,2308, 201,1864,4253,1430,7934,4026,7935, // 7318
7936,7937,7938,7939,4254,1604,7940, 414,1865, 371,2587,4534,4535,3485,2016,3104, // 7334
4536,1708, 960,4255, 887, 389,2171,1536,1663,1721,7941,2228,4027,2351,2926,1580, // 7350
7942,7943,7944,1744,7945,2537,4537,4538,7946,4539,7947,2073,7948,7949,3592,3380, // 7366
2882,4256,7950,4257,2640,3381,2802, 673,2703,2460, 709,3486,4028,3593,4258,7951, // 7382
1148, 502, 634,7952,7953,1204,4540,3594,1575,4541,2613,3717,7954,3718,3105, 948, // 7398
3232, 121,1745,3837,1110,7955,4259,3063,2509,3009,4029,3719,1151,1771,3838,1488, // 7414
4030,1986,7956,2433,3487,7957,7958,2093,7959,4260,3839,1213,1407,2803, 531,2737, // 7430
2538,3233,1011,1537,7960,2769,4261,3106,1061,7961,3720,3721,1866,2883,7962,2017, // 7446
 120,4262,4263,2062,3595,3234,2309,3840,2668,3382,1954,4542,7963,7964,3488,1047, // 7462
2704,1266,7965,1368,4543,2845, 649,3383,3841,2539,2738,1102,2846,2669,7966,7967, // 7478
1999,7968,1111,3596,2962,7969,2488,3842,3597,2804,1854,3384,3722,7970,7971,3385, // 7494
2410,2884,3304,3235,3598,7972,2569,7973,3599,2805,4031,1460, 856,7974,3600,7975, // 7510
2885,2963,7976,2886,3843,7977,4264, 632,2510, 875,3844,1697,3845,2291,7978,7979, // 7526
4544,3010,1239, 580,4545,4265,7980, 914, 936,2074,1190,4032,1039,2123,7981,7982, // 7542
7983,3386,1473,7984,1354,4266,3846,7985,2172,3064,4033, 915,3305,4267,4268,3306, // 7558
1605,1834,7986,2739, 398,3601,4269,3847,4034, 328,1912,2847,4035,3848,1331,4270, // 7574
3011, 937,4271,7987,3602,4036,4037,3387,2160,4546,3388, 524, 742, 538,3065,1012, // 7590
7988,7989,3849,2461,7990, 658,1103, 225,3850,7991,7992,4547,7993,4548,7994,3236, // 7606
1243,7995,4038, 963,2246,4549,7996,2705,3603,3161,7997,7998,2588,2327,7999,4550, // 7622
8000,8001,8002,3489,3307, 957,3389,2540,2032,1930,2927,2462, 870,2018,3604,1746, // 7638
2770,2771,2434,2463,8003,3851,8004,3723,3107,3724,3490,3390,3725,8005,1179,3066, // 7654
8006,3162,2373,4272,3726,2541,3163,3108,2740,4039,8007,3391,1556,2542,2292, 977, // 7670
2887,2033,4040,1205,3392,8008,1765,3393,3164,2124,1271,1689, 714,4551,3491,8009, // 7686
2328,3852, 533,4273,3605,2181, 617,8010,2464,3308,3492,2310,8011,8012,3165,8013, // 7702
8014,3853,1987, 618, 427,2641,3493,3394,8015,8016,1244,1690,8017,2806,4274,4552, // 7718
8018,3494,8019,8020,2279,1576, 473,3606,4275,3395, 972,8021,3607,8022,3067,8023, // 7734
8024,4553,4554,8025,3727,4041,4042,8026, 153,4555, 356,8027,1891,2888,4276,2143, // 7750
 408, 803,2352,8028,3854,8029,4277,1646,2570,2511,4556,4557,3855,8030,3856,4278, // 7766
8031,2411,3396, 752,8032,8033,1961,2964,8034, 746,3012,2465,8035,4279,3728, 698, // 7782
4558,1892,4280,3608,2543,4559,3609,3857,8036,3166,3397,8037,1823,1302,4043,2706, // 7798
3858,1973,4281,8038,4282,3167, 823,1303,1288,1236,2848,3495,4044,3398, 774,3859, // 7814
8039,1581,4560,1304,2849,3860,4561,8040,2435,2161,1083,3237,4283,4045,4284, 344, // 7830
1173, 288,2311, 454,1683,8041,8042,1461,4562,4046,2589,8043,8044,4563, 985, 894, // 7846
8045,3399,3168,8046,1913,2928,3729,1988,8047,2110,1974,8048,4047,8049,2571,1194, // 7862
 425,8050,4564,3169,1245,3730,4285,8051,8052,2850,8053, 636,4565,1855,3861, 760, // 7878
1799,8054,4286,2209,1508,4566,4048,1893,1684,2293,8055,8056,8057,4287,4288,2210, // 7894
 479,8058,8059, 832,8060,4049,2489,8061,2965,2490,3731, 990,3109, 627,1814,2642, // 7910
4289,1582,4290,2125,2111,3496,4567,8062, 799,4291,3170,8063,4568,2112,1737,3013, // 7926
1018, 543, 754,4292,3309,1676,4569,4570,4050,8064,1489,8065,3497,8066,2614,2889, // 7942
4051,8067,8068,2966,8069,8070,8071,8072,3171,4571,4572,2182,1722,8073,3238,3239, // 7958
1842,3610,1715, 481, 365,1975,1856,8074,8075,1962,2491,4573,8076,2126,3611,3240, // 7974
 433,1894,2063,2075,8077, 602,2741,8078,8079,8080,8081,8082,3014,1628,3400,8083, // 7990
3172,4574,4052,2890,4575,2512,8084,2544,2772,8085,8086,8087,3310,4576,2891,8088, // 8006
4577,8089,2851,4578,4579,1221,2967,4053,2513,8090,8091,8092,1867,1989,8093,8094, // 8022
8095,1895,8096,8097,4580,1896,4054, 318,8098,2094,4055,4293,8099,8100, 485,8101, // 8038
 938,3862, 553,2670, 116,8102,3863,3612,8103,3498,2671,2773,3401,3311,2807,8104, // 8054
3613,2929,4056,1747,2930,2968,8105,8106, 207,8107,8108,2672,4581,2514,8109,3015, // 8070
 890,3614,3864,8110,1877,3732,3402,8111,2183,2353,3403,1652,8112,8113,8114, 941, // 8086
2294, 208,3499,4057,2019, 330,4294,3865,2892,2492,3733,4295,8115,8116,8117,8118, // 8102
//Everything below is of no interest for detection purpose
2515,1613,4582,8119,3312,3866,2516,8120,4058,8121,1637,4059,2466,4583,3867,8122, // 8118
2493,3016,3734,8123,8124,2192,8125,8126,2162,8127,8128,8129,8130,8131,8132,8133, // 8134
8134,8135,8136,8137,8138,8139,8140,8141,8142,8143,8144,8145,8146,8147,8148,8149, // 8150
8150,8151,8152,8153,8154,8155,8156,8157,8158,8159,8160,8161,8162,8163,8164,8165, // 8166
8166,8167,8168,8169,8170,8171,8172,8173,8174,8175,8176,8177,8178,8179,8180,8181, // 8182
8182,8183,8184,8185,8186,8187,8188,8189,8190,8191,8192,8193,8194,8195,8196,8197, // 8198
8198,8199,8200,8201,8202,8203,8204,8205,8206,8207,8208,8209,8210,8211,8212,8213, // 8214
8214,8215,8216,8217,8218,8219,8220,8221,8222,8223,8224,8225,8226,8227,8228,8229, // 8230
8230,8231,8232,8233,8234,8235,8236,8237,8238,8239,8240,8241,8242,8243,8244,8245, // 8246
8246,8247,8248,8249,8250,8251,8252,8253,8254,8255,8256,8257,8258,8259,8260,8261, // 8262
8262,8263,8264,8265,8266,8267,8268,8269,8270,8271,8272,8273,8274,8275,8276,8277, // 8278
8278,8279,8280,8281,8282,8283,8284,8285,8286,8287,8288,8289,8290,8291,8292,8293, // 8294
8294,8295,8296,8297,8298,8299,8300,8301,8302,8303,8304,8305,8306,8307,8308,8309, // 8310
8310,8311,8312,8313,8314,8315,8316,8317,8318,8319,8320,8321,8322,8323,8324,8325, // 8326
8326,8327,8328,8329,8330,8331,8332,8333,8334,8335,8336,8337,8338,8339,8340,8341, // 8342
8342,8343,8344,8345,8346,8347,8348,8349,8350,8351,8352,8353,8354,8355,8356,8357, // 8358
8358,8359,8360,8361,8362,8363,8364,8365,8366,8367,8368,8369,8370,8371,8372,8373, // 8374
8374,8375,8376,8377,8378,8379,8380,8381,8382,8383,8384,8385,8386,8387,8388,8389, // 8390
8390,8391,8392,8393,8394,8395,8396,8397,8398,8399,8400,8401,8402,8403,8404,8405, // 8406
8406,8407,8408,8409,8410,8411,8412,8413,8414,8415,8416,8417,8418,8419,8420,8421, // 8422
8422,8423,8424,8425,8426,8427,8428,8429,8430,8431,8432,8433,8434,8435,8436,8437, // 8438
8438,8439,8440,8441,8442,8443,8444,8445,8446,8447,8448,8449,8450,8451,8452,8453, // 8454
8454,8455,8456,8457,8458,8459,8460,8461,8462,8463,8464,8465,8466,8467,8468,8469, // 8470
8470,8471,8472,8473,8474,8475,8476,8477,8478,8479,8480,8481,8482,8483,8484,8485, // 8486
8486,8487,8488,8489,8490,8491,8492,8493,8494,8495,8496,8497,8498,8499,8500,8501, // 8502
8502,8503,8504,8505,8506,8507,8508,8509,8510,8511,8512,8513,8514,8515,8516,8517, // 8518
8518,8519,8520,8521,8522,8523,8524,8525,8526,8527,8528,8529,8530,8531,8532,8533, // 8534
8534,8535,8536,8537,8538,8539,8540,8541,8542,8543,8544,8545,8546,8547,8548,8549, // 8550
8550,8551,8552,8553,8554,8555,8556,8557,8558,8559,8560,8561,8562,8563,8564,8565, // 8566
8566,8567,8568,8569,8570,8571,8572,8573,8574,8575,8576,8577,8578,8579,8580,8581, // 8582
8582,8583,8584,8585,8586,8587,8588,8589,8590,8591,8592,8593,8594,8595,8596,8597, // 8598
8598,8599,8600,8601,8602,8603,8604,8605,8606,8607,8608,8609,8610,8611,8612,8613, // 8614
8614,8615,8616,8617,8618,8619,8620,8621,8622,8623,8624,8625,8626,8627,8628,8629, // 8630
8630,8631,8632,8633,8634,8635,8636,8637,8638,8639,8640,8641,8642,8643,8644,8645, // 8646
8646,8647,8648,8649,8650,8651,8652,8653,8654,8655,8656,8657,8658,8659,8660,8661, // 8662
8662,8663,8664,8665,8666,8667,8668,8669,8670,8671,8672,8673,8674,8675,8676,8677, // 8678
8678,8679,8680,8681,8682,8683,8684,8685,8686,8687,8688,8689,8690,8691,8692,8693, // 8694
8694,8695,8696,8697,8698,8699,8700,8701,8702,8703,8704,8705,8706,8707,8708,8709, // 8710
8710,8711,8712,8713,8714,8715,8716,8717,8718,8719,8720,8721,8722,8723,8724,8725, // 8726
8726,8727,8728,8729,8730,8731,8732,8733,8734,8735,8736,8737,8738,8739,8740,8741
]; // 8742

/*
 * The Original Code is Mozilla Universal charset detector code.
 *
 * The Initial Developer of the Original Code is
 * Netscape Communications Corporation.
 * Portions created by the Initial Developer are Copyright (C) 2001
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   António Afonso (antonio.afonso gmail.com) - port to JavaScript
 *   Mark Pilgrim - port to Python
 *   Shy Shalom - original C code
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301  USA
 */

jschardet.CharDistributionAnalysis = function() {
    var ENOUGH_DATA_THRESHOLD = 1024;
    var SURE_YES = 0.99;
    var SURE_NO = 0.01;
    var self = this;

    function init() {
        self._mCharToFreqOrder = null; // Mapping table to get frequency order from char order (get from GetOrder())
        self._mTableSize = null; // Size of above table
        self._mTypicalDistributionRatio = null; // This is a constant value which varies from language to language, used in calculating confidence.  See http://www.mozilla.org/projects/intl/UniversalCharsetDetection.html for further detail.
        self.reset();
    }

    /**
     * reset analyser, clear any state
     */
    this.reset = function() {
        this._mDone = false; // If this flag is set to constants.True, detection is done and conclusion has been made
        this._mTotalChars = 0; // Total characters encountered
        this._mFreqChars = 0; // The number of characters whose frequency order is less than 512
    }

    /**
     * feed a character with known length
     */
    this.feed = function(aStr, aCharLen) {
        if( aCharLen == 2 ) {
            // we only care about 2-bytes character in our distribution analysis
            var order = this.getOrder(aStr);
        } else {
            order = -1;
        }
        if( order >= 0 ) {
            this._mTotalChars++;
            // order is valid
            if( order < this._mTableSize ) {
                if( 512 > this._mCharToFreqOrder[order] ) {
                    this._mFreqChars++;
                }
            }
        }
    }

    /**
     * return confidence based on existing data
     */
    this.getConfidence = function() {
        // if we didn't receive any character in our consideration range, return negative answer
        if( this._mTotalChars <= 0 ) {
            return SURE_NO;
        }
        if( this._mTotalChars != this._mFreqChars ) {
            var r = this._mFreqChars / ((this._mTotalChars - this._mFreqChars) * this._mTypicalDistributionRatio);
            if( r < SURE_YES ) {
                return r;
            }
        }

        // normalize confidence (we don't want to be 100% sure)
        return SURE_YES;
    }

    this.gotEnoughData = function() {
        // It is not necessary to receive all data to draw conclusion. For charset detection,
        // certain amount of data is enough
        return this._mTotalChars > ENOUGH_DATA_THRESHOLD;
    }

    this.getOrder = function(aStr) {
        // We do not handle characters based on the original encoding string, but
        // convert this encoding string to a number, here called order.
        // This allows multiple encodings of a language to share one frequency table.
        return -1;
    }

    init();
}

jschardet.EUCTWDistributionAnalysis = function() {
    jschardet.CharDistributionAnalysis.apply(this);

    var self = this;

    function init() {
        self._mCharToFreqOrder = jschardet.EUCTWCharToFreqOrder;
        self._mTableSize = jschardet.EUCTW_TABLE_SIZE;
        self._mTypicalDistributionRatio = jschardet.EUCTW_TYPICAL_DISTRIBUTION_RATIO;
    }

    this.getOrder = function(aStr) {
        // for euc-TW encoding, we are interested
        //   first  byte range: 0xc4 -- 0xfe
        //   second byte range: 0xa1 -- 0xfe
        // no validation needed here. State machine has done that
        if( aStr.charCodeAt(0) >= 0xC4 ) {
            return 94 * (aStr.charCodeAt(0) - 0xC4) + aStr.charCodeAt(1) - 0xA1;
        } else {
            return -1;
        }
    }

    init();
}
jschardet.EUCTWDistributionAnalysis.prototype = new jschardet.CharDistributionAnalysis();

jschardet.EUCKRDistributionAnalysis = function() {
    jschardet.CharDistributionAnalysis.apply(this);

    var self = this;

    function init() {
        self._mCharToFreqOrder = jschardet.EUCKRCharToFreqOrder;
        self._mTableSize = jschardet.EUCKR_TABLE_SIZE;
        self._mTypicalDistributionRatio = jschardet.EUCKR_TYPICAL_DISTRIBUTION_RATIO;
    }

    this.getOrder = function(aStr) {
        // for euc-KR encoding, we are interested
        //   first  byte range: 0xb0 -- 0xfe
        //   second byte range: 0xa1 -- 0xfe
        // no validation needed here. State machine has done that
        if( aStr.charCodeAt(0) >= 0xB0 ) {
            return 94 * (aStr.charCodeAt(0) - 0xB0) + aStr.charCodeAt(1) - 0xA1;
        } else {
            return -1;
        }
    }

    init();
}
jschardet.EUCKRDistributionAnalysis.prototype = new jschardet.CharDistributionAnalysis();

jschardet.GB2312DistributionAnalysis = function() {
    jschardet.CharDistributionAnalysis.apply(this);

    var self = this;

    function init() {
        self._mCharToFreqOrder = jschardet.GB2312CharToFreqOrder;
        self._mTableSize = jschardet.GB2312_TABLE_SIZE;
        self._mTypicalDistributionRatio = jschardet.GB2312_TYPICAL_DISTRIBUTION_RATIO;
    }

    this.getOrder = function(aStr) {
        // for GB2312 encoding, we are interested
        //  first  byte range: 0xb0 -- 0xfe
        //  second byte range: 0xa1 -- 0xfe
        // no validation needed here. State machine has done that
        if( aStr.charCodeAt(0) >= 0xB0 && aStr.charCodeAt(1) >= 0xA1 ) {
            return 94 * (aStr.charCodeAt(0) - 0xB0) + aStr.charCodeAt(1) - 0xA1;
        } else {
            return -1;
        }
    }

    init();
}
jschardet.GB2312DistributionAnalysis.prototype = new jschardet.CharDistributionAnalysis();

jschardet.Big5DistributionAnalysis = function() {
    jschardet.CharDistributionAnalysis.apply(this);

    var self = this;

    function init() {
        self._mCharToFreqOrder = jschardet.Big5CharToFreqOrder;
        self._mTableSize = jschardet.BIG5_TABLE_SIZE;
        self._mTypicalDistributionRatio = jschardet.BIG5_TYPICAL_DISTRIBUTION_RATIO;
    }

    this.getOrder = function(aStr) {
        // for big5 encoding, we are interested
        //   first  byte range: 0xa4 -- 0xfe
        //   second byte range: 0x40 -- 0x7e , 0xa1 -- 0xfe
        // no validation needed here. State machine has done that
        if( aStr.charCodeAt(0) >= 0xA4 ) {
            if( aStr.charCodeAt(1) >= 0xA1 ) {
                return 157 * (aStr.charCodeAt(0) - 0xA4) + aStr.charCodeAt(1) - 0xA1 + 63;
            } else {
                return 157 * (aStr.charCodeAt(0) - 0xA4) + aStr.charCodeAt(1) - 0x40;
            }
        } else {
            return -1;
        }
    }

    init();
}
jschardet.Big5DistributionAnalysis.prototype = new jschardet.CharDistributionAnalysis();

jschardet.SJISDistributionAnalysis = function() {
    jschardet.CharDistributionAnalysis.apply(this);

    var self = this;

    function init() {
        self._mCharToFreqOrder = jschardet.JISCharToFreqOrder;
        self._mTableSize = jschardet.JIS_TABLE_SIZE;
        self._mTypicalDistributionRatio = jschardet.JIS_TYPICAL_DISTRIBUTION_RATIO;
    }

    this.getOrder = function(aStr) {
        // for sjis encoding, we are interested
        //   first  byte range: 0x81 -- 0x9f , 0xe0 -- 0xfe
        //   second byte range: 0x40 -- 0x7e,  0x81 -- 0xfe
        // no validation needed here. State machine has done that
        if( aStr.charCodeAt(0) >= 0x81 && aStr.charCodeAt(0) <= 0x9F ) {
            var order = 188 * (aStr.charCodeAt(0) - 0x81);
        } else if( aStr.charCodeAt(0) >= 0xE0 && aStr.charCodeAt(0) <= 0xEF ) {
            order = 188 * (aStr.charCodeAt(0) - 0xE0 + 31);
        } else {
            return -1;
        }
        order += aStr.charCodeAt(1) - 0x40;
        if( aStr.charCodeAt(1) > 0x7F ) {
            order = -1;
        }
        return order;
    }

    init();
}
jschardet.SJISDistributionAnalysis.prototype = new jschardet.CharDistributionAnalysis();

jschardet.EUCJPDistributionAnalysis = function() {
    jschardet.CharDistributionAnalysis.apply(this);

    var self = this;

    function init() {
        self._mCharToFreqOrder = jschardet.JISCharToFreqOrder;
        self._mTableSize = jschardet.JIS_TABLE_SIZE;
        self._mTypicalDistributionRatio = jschardet.JIS_TYPICAL_DISTRIBUTION_RATIO;
    }

    this.getOrder = function(aStr) {
        // for euc-JP encoding, we are interested
        //   first  byte range: 0xa0 -- 0xfe
        //   second byte range: 0xa1 -- 0xfe
        // no validation needed here. State machine has done that
        if( aStr[0] >= "\xA0" ) {
            return 94 * (aStr.charCodeAt(0) - 0xA1) + aStr.charCodeAt(1) - 0xA1;
        } else {
            return -1;
        }
    }

    init();
}
jschardet.EUCJPDistributionAnalysis.prototype = new jschardet.CharDistributionAnalysis();
/*
 * The Original Code is Mozilla Universal charset detector code.
 *
 * The Initial Developer of the Original Code is
 * Netscape Communications Corporation.
 * Portions created by the Initial Developer are Copyright (C) 2001
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   António Afonso (antonio.afonso gmail.com) - port to JavaScript
 *   Mark Pilgrim - port to Python
 *   Shy Shalom - original C code
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301  USA
 */

// This is hiragana 2-char sequence table, the number in each cell represents its frequency category
jschardet.jp2CharContext = [
[0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
[2,4,0,4,0,3,0,4,0,3,4,4,4,2,4,3,3,4,3,2,3,3,4,2,3,3,3,2,4,1,4,3,3,1,5,4,3,4,3,4,3,5,3,0,3,5,4,2,0,3,1,0,3,3,0,3,3,0,1,1,0,4,3,0,3,3,0,4,0,2,0,3,5,5,5,5,4,0,4,1,0,3,4],
[0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
[0,4,0,5,0,5,0,4,0,4,5,4,4,3,5,3,5,1,5,3,4,3,4,4,3,4,3,3,4,3,5,4,4,3,5,5,3,5,5,5,3,5,5,3,4,5,5,3,1,3,2,0,3,4,0,4,2,0,4,2,1,5,3,2,3,5,0,4,0,2,0,5,4,4,5,4,5,0,4,0,0,4,4],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,3,0,4,0,3,0,3,0,4,5,4,3,3,3,3,4,3,5,4,4,3,5,4,4,3,4,3,4,4,4,4,5,3,4,4,3,4,5,5,4,5,5,1,4,5,4,3,0,3,3,1,3,3,0,4,4,0,3,3,1,5,3,3,3,5,0,4,0,3,0,4,4,3,4,3,3,0,4,1,1,3,4],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,4,0,3,0,3,0,4,0,3,4,4,3,2,2,1,2,1,3,1,3,3,3,3,3,4,3,1,3,3,5,3,3,0,4,3,0,5,4,3,3,5,4,4,3,4,4,5,0,1,2,0,1,2,0,2,2,0,1,0,0,5,2,2,1,4,0,3,0,1,0,4,4,3,5,4,3,0,2,1,0,4,3],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,3,0,5,0,4,0,2,1,4,4,2,4,1,4,2,4,2,4,3,3,3,4,3,3,3,3,1,4,2,3,3,3,1,4,4,1,1,1,4,3,3,2,0,2,4,3,2,0,3,3,0,3,1,1,0,0,0,3,3,0,4,2,2,3,4,0,4,0,3,0,4,4,5,3,4,4,0,3,0,0,1,4],
[1,4,0,4,0,4,0,4,0,3,5,4,4,3,4,3,5,4,3,3,4,3,5,4,4,4,4,3,4,2,4,3,3,1,5,4,3,2,4,5,4,5,5,4,4,5,4,4,0,3,2,2,3,3,0,4,3,1,3,2,1,4,3,3,4,5,0,3,0,2,0,4,5,5,4,5,4,0,4,0,0,5,4],
[0,5,0,5,0,4,0,3,0,4,4,3,4,3,3,3,4,0,4,4,4,3,4,3,4,3,3,1,4,2,4,3,4,0,5,4,1,4,5,4,4,5,3,2,4,3,4,3,2,4,1,3,3,3,2,3,2,0,4,3,3,4,3,3,3,4,0,4,0,3,0,4,5,4,4,4,3,0,4,1,0,1,3],
[0,3,1,4,0,3,0,2,0,3,4,4,3,1,4,2,3,3,4,3,4,3,4,3,4,4,3,2,3,1,5,4,4,1,4,4,3,5,4,4,3,5,5,4,3,4,4,3,1,2,3,1,2,2,0,3,2,0,3,1,0,5,3,3,3,4,3,3,3,3,4,4,4,4,5,4,2,0,3,3,2,4,3],
[0,2,0,3,0,1,0,1,0,0,3,2,0,0,2,0,1,0,2,1,3,3,3,1,2,3,1,0,1,0,4,2,1,1,3,3,0,4,3,3,1,4,3,3,0,3,3,2,0,0,0,0,1,0,0,2,0,0,0,0,0,4,1,0,2,3,2,2,2,1,3,3,3,4,4,3,2,0,3,1,0,3,3],
[0,4,0,4,0,3,0,3,0,4,4,4,3,3,3,3,3,3,4,3,4,2,4,3,4,3,3,2,4,3,4,5,4,1,4,5,3,5,4,5,3,5,4,0,3,5,5,3,1,3,3,2,2,3,0,3,4,1,3,3,2,4,3,3,3,4,0,4,0,3,0,4,5,4,4,5,3,0,4,1,0,3,4],
[0,2,0,3,0,3,0,0,0,2,2,2,1,0,1,0,0,0,3,0,3,0,3,0,1,3,1,0,3,1,3,3,3,1,3,3,3,0,1,3,1,3,4,0,0,3,1,1,0,3,2,0,0,0,0,1,3,0,1,0,0,3,3,2,0,3,0,0,0,0,0,3,4,3,4,3,3,0,3,0,0,2,3],
[2,3,0,3,0,2,0,1,0,3,3,4,3,1,3,1,1,1,3,1,4,3,4,3,3,3,0,0,3,1,5,4,3,1,4,3,2,5,5,4,4,4,4,3,3,4,4,4,0,2,1,1,3,2,0,1,2,0,0,1,0,4,1,3,3,3,0,3,0,1,0,4,4,4,5,5,3,0,2,0,0,4,4],
[0,2,0,1,0,3,1,3,0,2,3,3,3,0,3,1,0,0,3,0,3,2,3,1,3,2,1,1,0,0,4,2,1,0,2,3,1,4,3,2,0,4,4,3,1,3,1,3,0,1,0,0,1,0,0,0,1,0,0,0,0,4,1,1,1,2,0,3,0,0,0,3,4,2,4,3,2,0,1,0,0,3,3],
[0,1,0,4,0,5,0,4,0,2,4,4,2,3,3,2,3,3,5,3,3,3,4,3,4,2,3,0,4,3,3,3,4,1,4,3,2,1,5,5,3,4,5,1,3,5,4,2,0,3,3,0,1,3,0,4,2,0,1,3,1,4,3,3,3,3,0,3,0,1,0,3,4,4,4,5,5,0,3,0,1,4,5],
[0,2,0,3,0,3,0,0,0,2,3,1,3,0,4,0,1,1,3,0,3,4,3,2,3,1,0,3,3,2,3,1,3,0,2,3,0,2,1,4,1,2,2,0,0,3,3,0,0,2,0,0,0,1,0,0,0,0,2,2,0,3,2,1,3,3,0,2,0,2,0,0,3,3,1,2,4,0,3,0,2,2,3],
[2,4,0,5,0,4,0,4,0,2,4,4,4,3,4,3,3,3,1,2,4,3,4,3,4,4,5,0,3,3,3,3,2,0,4,3,1,4,3,4,1,4,4,3,3,4,4,3,1,2,3,0,4,2,0,4,1,0,3,3,0,4,3,3,3,4,0,4,0,2,0,3,5,3,4,5,2,0,3,0,0,4,5],
[0,3,0,4,0,1,0,1,0,1,3,2,2,1,3,0,3,0,2,0,2,0,3,0,2,0,0,0,1,0,1,1,0,0,3,1,0,0,0,4,0,3,1,0,2,1,3,0,0,0,0,0,0,3,0,0,0,0,0,0,0,4,2,2,3,1,0,3,0,0,0,1,4,4,4,3,0,0,4,0,0,1,4],
[1,4,1,5,0,3,0,3,0,4,5,4,4,3,5,3,3,4,4,3,4,1,3,3,3,3,2,1,4,1,5,4,3,1,4,4,3,5,4,4,3,5,4,3,3,4,4,4,0,3,3,1,2,3,0,3,1,0,3,3,0,5,4,4,4,4,4,4,3,3,5,4,4,3,3,5,4,0,3,2,0,4,4],
[0,2,0,3,0,1,0,0,0,1,3,3,3,2,4,1,3,0,3,1,3,0,2,2,1,1,0,0,2,0,4,3,1,0,4,3,0,4,4,4,1,4,3,1,1,3,3,1,0,2,0,0,1,3,0,0,0,0,2,0,0,4,3,2,4,3,5,4,3,3,3,4,3,3,4,3,3,0,2,1,0,3,3],
[0,2,0,4,0,3,0,2,0,2,5,5,3,4,4,4,4,1,4,3,3,0,4,3,4,3,1,3,3,2,4,3,0,3,4,3,0,3,4,4,2,4,4,0,4,5,3,3,2,2,1,1,1,2,0,1,5,0,3,3,2,4,3,3,3,4,0,3,0,2,0,4,4,3,5,5,0,0,3,0,2,3,3],
[0,3,0,4,0,3,0,1,0,3,4,3,3,1,3,3,3,0,3,1,3,0,4,3,3,1,1,0,3,0,3,3,0,0,4,4,0,1,5,4,3,3,5,0,3,3,4,3,0,2,0,1,1,1,0,1,3,0,1,2,1,3,3,2,3,3,0,3,0,1,0,1,3,3,4,4,1,0,1,2,2,1,3],
[0,1,0,4,0,4,0,3,0,1,3,3,3,2,3,1,1,0,3,0,3,3,4,3,2,4,2,0,1,0,4,3,2,0,4,3,0,5,3,3,2,4,4,4,3,3,3,4,0,1,3,0,0,1,0,0,1,0,0,0,0,4,2,3,3,3,0,3,0,0,0,4,4,4,5,3,2,0,3,3,0,3,5],
[0,2,0,3,0,0,0,3,0,1,3,0,2,0,0,0,1,0,3,1,1,3,3,0,0,3,0,0,3,0,2,3,1,0,3,1,0,3,3,2,0,4,2,2,0,2,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,2,1,2,0,1,0,1,0,0,0,1,3,1,2,0,0,0,1,0,0,1,4],
[0,3,0,3,0,5,0,1,0,2,4,3,1,3,3,2,1,1,5,2,1,0,5,1,2,0,0,0,3,3,2,2,3,2,4,3,0,0,3,3,1,3,3,0,2,5,3,4,0,3,3,0,1,2,0,2,2,0,3,2,0,2,2,3,3,3,0,2,0,1,0,3,4,4,2,5,4,0,3,0,0,3,5],
[0,3,0,3,0,3,0,1,0,3,3,3,3,0,3,0,2,0,2,1,1,0,2,0,1,0,0,0,2,1,0,0,1,0,3,2,0,0,3,3,1,2,3,1,0,3,3,0,0,1,0,0,0,0,0,2,0,0,0,0,0,2,3,1,2,3,0,3,0,1,0,3,2,1,0,4,3,0,1,1,0,3,3],
[0,4,0,5,0,3,0,3,0,4,5,5,4,3,5,3,4,3,5,3,3,2,5,3,4,4,4,3,4,3,4,5,5,3,4,4,3,4,4,5,4,4,4,3,4,5,5,4,2,3,4,2,3,4,0,3,3,1,4,3,2,4,3,3,5,5,0,3,0,3,0,5,5,5,5,4,4,0,4,0,1,4,4],
[0,4,0,4,0,3,0,3,0,3,5,4,4,2,3,2,5,1,3,2,5,1,4,2,3,2,3,3,4,3,3,3,3,2,5,4,1,3,3,5,3,4,4,0,4,4,3,1,1,3,1,0,2,3,0,2,3,0,3,0,0,4,3,1,3,4,0,3,0,2,0,4,4,4,3,4,5,0,4,0,0,3,4],
[0,3,0,3,0,3,1,2,0,3,4,4,3,3,3,0,2,2,4,3,3,1,3,3,3,1,1,0,3,1,4,3,2,3,4,4,2,4,4,4,3,4,4,3,2,4,4,3,1,3,3,1,3,3,0,4,1,0,2,2,1,4,3,2,3,3,5,4,3,3,5,4,4,3,3,0,4,0,3,2,2,4,4],
[0,2,0,1,0,0,0,0,0,1,2,1,3,0,0,0,0,0,2,0,1,2,1,0,0,1,0,0,0,0,3,0,0,1,0,1,1,3,1,0,0,0,1,1,0,1,1,0,0,0,0,0,2,0,0,0,0,0,0,0,0,1,1,2,2,0,3,4,0,0,0,1,1,0,0,1,0,0,0,0,0,1,1],
[0,1,0,0,0,1,0,0,0,0,4,0,4,1,4,0,3,0,4,0,3,0,4,0,3,0,3,0,4,1,5,1,4,0,0,3,0,5,0,5,2,0,1,0,0,0,2,1,4,0,1,3,0,0,3,0,0,3,1,1,4,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
[1,4,0,5,0,3,0,2,0,3,5,4,4,3,4,3,5,3,4,3,3,0,4,3,3,3,3,3,3,2,4,4,3,1,3,4,4,5,4,4,3,4,4,1,3,5,4,3,3,3,1,2,2,3,3,1,3,1,3,3,3,5,3,3,4,5,0,3,0,3,0,3,4,3,4,4,3,0,3,0,2,4,3],
[0,1,0,4,0,0,0,0,0,1,4,0,4,1,4,2,4,0,3,0,1,0,1,0,0,0,0,0,2,0,3,1,1,1,0,3,0,0,0,1,2,1,0,0,1,1,1,1,0,1,0,0,0,1,0,0,3,0,0,0,0,3,2,0,2,2,0,1,0,0,0,2,3,2,3,3,0,0,0,0,2,1,0],
[0,5,1,5,0,3,0,3,0,5,4,4,5,1,5,3,3,0,4,3,4,3,5,3,4,3,3,2,4,3,4,3,3,0,3,3,1,4,4,3,4,4,4,3,4,5,5,3,2,3,1,1,3,3,1,3,1,1,3,3,2,4,5,3,3,5,0,4,0,3,0,4,4,3,5,3,3,0,3,4,0,4,3],
[0,5,0,5,0,3,0,2,0,4,4,3,5,2,4,3,3,3,4,4,4,3,5,3,5,3,3,1,4,0,4,3,3,0,3,3,0,4,4,4,4,5,4,3,3,5,5,3,2,3,1,2,3,2,0,1,0,0,3,2,2,4,4,3,1,5,0,4,0,3,0,4,3,1,3,2,1,0,3,3,0,3,3],
[0,4,0,5,0,5,0,4,0,4,5,5,5,3,4,3,3,2,5,4,4,3,5,3,5,3,4,0,4,3,4,4,3,2,4,4,3,4,5,4,4,5,5,0,3,5,5,4,1,3,3,2,3,3,1,3,1,0,4,3,1,4,4,3,4,5,0,4,0,2,0,4,3,4,4,3,3,0,4,0,0,5,5],
[0,4,0,4,0,5,0,1,1,3,3,4,4,3,4,1,3,0,5,1,3,0,3,1,3,1,1,0,3,0,3,3,4,0,4,3,0,4,4,4,3,4,4,0,3,5,4,1,0,3,0,0,2,3,0,3,1,0,3,1,0,3,2,1,3,5,0,3,0,1,0,3,2,3,3,4,4,0,2,2,0,4,4],
[2,4,0,5,0,4,0,3,0,4,5,5,4,3,5,3,5,3,5,3,5,2,5,3,4,3,3,4,3,4,5,3,2,1,5,4,3,2,3,4,5,3,4,1,2,5,4,3,0,3,3,0,3,2,0,2,3,0,4,1,0,3,4,3,3,5,0,3,0,1,0,4,5,5,5,4,3,0,4,2,0,3,5],
[0,5,0,4,0,4,0,2,0,5,4,3,4,3,4,3,3,3,4,3,4,2,5,3,5,3,4,1,4,3,4,4,4,0,3,5,0,4,4,4,4,5,3,1,3,4,5,3,3,3,3,3,3,3,0,2,2,0,3,3,2,4,3,3,3,5,3,4,1,3,3,5,3,2,0,0,0,0,4,3,1,3,3],
[0,1,0,3,0,3,0,1,0,1,3,3,3,2,3,3,3,0,3,0,0,0,3,1,3,0,0,0,2,2,2,3,0,0,3,2,0,1,2,4,1,3,3,0,0,3,3,3,0,1,0,0,2,1,0,0,3,0,3,1,0,3,0,0,1,3,0,2,0,1,0,3,3,1,3,3,0,0,1,1,0,3,3],
[0,2,0,3,0,2,1,4,0,2,2,3,1,1,3,1,1,0,2,0,3,1,2,3,1,3,0,0,1,0,4,3,2,3,3,3,1,4,2,3,3,3,3,1,0,3,1,4,0,1,1,0,1,2,0,1,1,0,1,1,0,3,1,3,2,2,0,1,0,0,0,2,3,3,3,1,0,0,0,0,0,2,3],
[0,5,0,4,0,5,0,2,0,4,5,5,3,3,4,3,3,1,5,4,4,2,4,4,4,3,4,2,4,3,5,5,4,3,3,4,3,3,5,5,4,5,5,1,3,4,5,3,1,4,3,1,3,3,0,3,3,1,4,3,1,4,5,3,3,5,0,4,0,3,0,5,3,3,1,4,3,0,4,0,1,5,3],
[0,5,0,5,0,4,0,2,0,4,4,3,4,3,3,3,3,3,5,4,4,4,4,4,4,5,3,3,5,2,4,4,4,3,4,4,3,3,4,4,5,5,3,3,4,3,4,3,3,4,3,3,3,3,1,2,2,1,4,3,3,5,4,4,3,4,0,4,0,3,0,4,4,4,4,4,1,0,4,2,0,2,4],
[0,4,0,4,0,3,0,1,0,3,5,2,3,0,3,0,2,1,4,2,3,3,4,1,4,3,3,2,4,1,3,3,3,0,3,3,0,0,3,3,3,5,3,3,3,3,3,2,0,2,0,0,2,0,0,2,0,0,1,0,0,3,1,2,2,3,0,3,0,2,0,4,4,3,3,4,1,0,3,0,0,2,4],
[0,0,0,4,0,0,0,0,0,0,1,0,1,0,2,0,0,0,0,0,1,0,2,0,1,0,0,0,0,0,3,1,3,0,3,2,0,0,0,1,0,3,2,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,0,2,0,0,0,0,0,0,2],
[0,2,1,3,0,2,0,2,0,3,3,3,3,1,3,1,3,3,3,3,3,3,4,2,2,1,2,1,4,0,4,3,1,3,3,3,2,4,3,5,4,3,3,3,3,3,3,3,0,1,3,0,2,0,0,1,0,0,1,0,0,4,2,0,2,3,0,3,3,0,3,3,4,2,3,1,4,0,1,2,0,2,3],
[0,3,0,3,0,1,0,3,0,2,3,3,3,0,3,1,2,0,3,3,2,3,3,2,3,2,3,1,3,0,4,3,2,0,3,3,1,4,3,3,2,3,4,3,1,3,3,1,1,0,1,1,0,1,0,1,0,1,0,0,0,4,1,1,0,3,0,3,1,0,2,3,3,3,3,3,1,0,0,2,0,3,3],
[0,0,0,0,0,0,0,0,0,0,3,0,2,0,3,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,3,0,3,0,3,1,0,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,2,0,2,3,0,0,0,0,0,0,0,0,3],
[0,2,0,3,1,3,0,3,0,2,3,3,3,1,3,1,3,1,3,1,3,3,3,1,3,0,2,3,1,1,4,3,3,2,3,3,1,2,2,4,1,3,3,0,1,4,2,3,0,1,3,0,3,0,0,1,3,0,2,0,0,3,3,2,1,3,0,3,0,2,0,3,4,4,4,3,1,0,3,0,0,3,3],
[0,2,0,1,0,2,0,0,0,1,3,2,2,1,3,0,1,1,3,0,3,2,3,1,2,0,2,0,1,1,3,3,3,0,3,3,1,1,2,3,2,3,3,1,2,3,2,0,0,1,0,0,0,0,0,0,3,0,1,0,0,2,1,2,1,3,0,3,0,0,0,3,4,4,4,3,2,0,2,0,0,2,4],
[0,0,0,1,0,1,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,2,2,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,3,1,0,0,0,0,0,0,0,3],
[0,3,0,3,0,2,0,3,0,3,3,3,2,3,2,2,2,0,3,1,3,3,3,2,3,3,0,0,3,0,3,2,2,0,2,3,1,4,3,4,3,3,2,3,1,5,4,4,0,3,1,2,1,3,0,3,1,1,2,0,2,3,1,3,1,3,0,3,0,1,0,3,3,4,4,2,1,0,2,1,0,2,4],
[0,1,0,3,0,1,0,2,0,1,4,2,5,1,4,0,2,0,2,1,3,1,4,0,2,1,0,0,2,1,4,1,1,0,3,3,0,5,1,3,2,3,3,1,0,3,2,3,0,1,0,0,0,0,0,0,1,0,0,0,0,4,0,1,0,3,0,2,0,1,0,3,3,3,4,3,3,0,0,0,0,2,3],
[0,0,0,1,0,0,0,0,0,0,2,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1,0,0,1,0,0,0,0,0,3],
[0,1,0,3,0,4,0,3,0,2,4,3,1,0,3,2,2,1,3,1,2,2,3,1,1,1,2,1,3,0,1,2,0,1,3,2,1,3,0,5,5,1,0,0,1,3,2,1,0,3,0,0,1,0,0,0,0,0,3,4,0,1,1,1,3,2,0,2,0,1,0,2,3,3,1,2,3,0,1,0,1,0,4],
[0,0,0,1,0,3,0,3,0,2,2,1,0,0,4,0,3,0,3,1,3,0,3,0,3,0,1,0,3,0,3,1,3,0,3,3,0,0,1,2,1,1,1,0,1,2,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,2,2,1,2,0,0,2,0,0,0,0,2,3,3,3,3,0,0,0,0,1,4],
[0,0,0,3,0,3,0,0,0,0,3,1,1,0,3,0,1,0,2,0,1,0,0,0,0,0,0,0,1,0,3,0,2,0,2,3,0,0,2,2,3,1,2,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,2,0,0,0,0,2,3],
[2,4,0,5,0,5,0,4,0,3,4,3,3,3,4,3,3,3,4,3,4,4,5,4,5,5,5,2,3,0,5,5,4,1,5,4,3,1,5,4,3,4,4,3,3,4,3,3,0,3,2,0,2,3,0,3,0,0,3,3,0,5,3,2,3,3,0,3,0,3,0,3,4,5,4,5,3,0,4,3,0,3,4],
[0,3,0,3,0,3,0,3,0,3,3,4,3,2,3,2,3,0,4,3,3,3,3,3,3,3,3,0,3,2,4,3,3,1,3,4,3,4,4,4,3,4,4,3,2,4,4,1,0,2,0,0,1,1,0,2,0,0,3,1,0,5,3,2,1,3,0,3,0,1,2,4,3,2,4,3,3,0,3,2,0,4,4],
[0,3,0,3,0,1,0,0,0,1,4,3,3,2,3,1,3,1,4,2,3,2,4,2,3,4,3,0,2,2,3,3,3,0,3,3,3,0,3,4,1,3,3,0,3,4,3,3,0,1,1,0,1,0,0,0,4,0,3,0,0,3,1,2,1,3,0,4,0,1,0,4,3,3,4,3,3,0,2,0,0,3,3],
[0,3,0,4,0,1,0,3,0,3,4,3,3,0,3,3,3,1,3,1,3,3,4,3,3,3,0,0,3,1,5,3,3,1,3,3,2,5,4,3,3,4,5,3,2,5,3,4,0,1,0,0,0,0,0,2,0,0,1,1,0,4,2,2,1,3,0,3,0,2,0,4,4,3,5,3,2,0,1,1,0,3,4],
[0,5,0,4,0,5,0,2,0,4,4,3,3,2,3,3,3,1,4,3,4,1,5,3,4,3,4,0,4,2,4,3,4,1,5,4,0,4,4,4,4,5,4,1,3,5,4,2,1,4,1,1,3,2,0,3,1,0,3,2,1,4,3,3,3,4,0,4,0,3,0,4,4,4,3,3,3,0,4,2,0,3,4],
[1,4,0,4,0,3,0,1,0,3,3,3,1,1,3,3,2,2,3,3,1,0,3,2,2,1,2,0,3,1,2,1,2,0,3,2,0,2,2,3,3,4,3,0,3,3,1,2,0,1,1,3,1,2,0,0,3,0,1,1,0,3,2,2,3,3,0,3,0,0,0,2,3,3,4,3,3,0,1,0,0,1,4],
[0,4,0,4,0,4,0,0,0,3,4,4,3,1,4,2,3,2,3,3,3,1,4,3,4,0,3,0,4,2,3,3,2,2,5,4,2,1,3,4,3,4,3,1,3,3,4,2,0,2,1,0,3,3,0,0,2,0,3,1,0,4,4,3,4,3,0,4,0,1,0,2,4,4,4,4,4,0,3,2,0,3,3],
[0,0,0,1,0,4,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,3,2,0,0,1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,2],
[0,2,0,3,0,4,0,4,0,1,3,3,3,0,4,0,2,1,2,1,1,1,2,0,3,1,1,0,1,0,3,1,0,0,3,3,2,0,1,1,0,0,0,0,0,1,0,2,0,2,2,0,3,1,0,0,1,0,1,1,0,1,2,0,3,0,0,0,0,1,0,0,3,3,4,3,1,0,1,0,3,0,2],
[0,0,0,3,0,5,0,0,0,0,1,0,2,0,3,1,0,1,3,0,0,0,2,0,0,0,1,0,0,0,1,1,0,0,4,0,0,0,2,3,0,1,4,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,1,0,0,0,0,0,0,0,2,0,0,3,0,0,0,0,0,3],
[0,2,0,5,0,5,0,1,0,2,4,3,3,2,5,1,3,2,3,3,3,0,4,1,2,0,3,0,4,0,2,2,1,1,5,3,0,0,1,4,2,3,2,0,3,3,3,2,0,2,4,1,1,2,0,1,1,0,3,1,0,1,3,1,2,3,0,2,0,0,0,1,3,5,4,4,4,0,3,0,0,1,3],
[0,4,0,5,0,4,0,4,0,4,5,4,3,3,4,3,3,3,4,3,4,4,5,3,4,5,4,2,4,2,3,4,3,1,4,4,1,3,5,4,4,5,5,4,4,5,5,5,2,3,3,1,4,3,1,3,3,0,3,3,1,4,3,4,4,4,0,3,0,4,0,3,3,4,4,5,0,0,4,3,0,4,5],
[0,4,0,4,0,3,0,3,0,3,4,4,4,3,3,2,4,3,4,3,4,3,5,3,4,3,2,1,4,2,4,4,3,1,3,4,2,4,5,5,3,4,5,4,1,5,4,3,0,3,2,2,3,2,1,3,1,0,3,3,3,5,3,3,3,5,4,4,2,3,3,4,3,3,3,2,1,0,3,2,1,4,3],
[0,4,0,5,0,4,0,3,0,3,5,5,3,2,4,3,4,0,5,4,4,1,4,4,4,3,3,3,4,3,5,5,2,3,3,4,1,2,5,5,3,5,5,2,3,5,5,4,0,3,2,0,3,3,1,1,5,1,4,1,0,4,3,2,3,5,0,4,0,3,0,5,4,3,4,3,0,0,4,1,0,4,4],
[1,3,0,4,0,2,0,2,0,2,5,5,3,3,3,3,3,0,4,2,3,4,4,4,3,4,0,0,3,4,5,4,3,3,3,3,2,5,5,4,5,5,5,4,3,5,5,5,1,3,1,0,1,0,0,3,2,0,4,2,0,5,2,3,2,4,1,3,0,3,0,4,5,4,5,4,3,0,4,2,0,5,4],
[0,3,0,4,0,5,0,3,0,3,4,4,3,2,3,2,3,3,3,3,3,2,4,3,3,2,2,0,3,3,3,3,3,1,3,3,3,0,4,4,3,4,4,1,1,4,4,2,0,3,1,0,1,1,0,4,1,0,2,3,1,3,3,1,3,4,0,3,0,1,0,3,1,3,0,0,1,0,2,0,0,4,4],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,3,0,3,0,2,0,3,0,1,5,4,3,3,3,1,4,2,1,2,3,4,4,2,4,4,5,0,3,1,4,3,4,0,4,3,3,3,2,3,2,5,3,4,3,2,2,3,0,0,3,0,2,1,0,1,2,0,0,0,0,2,1,1,3,1,0,2,0,4,0,3,4,4,4,5,2,0,2,0,0,1,3],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,1,1,0,0,1,1,0,0,0,4,2,1,1,0,1,0,3,2,0,0,3,1,1,1,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,1,0,0,0,2,0,0,0,1,4,0,4,2,1,0,0,0,0,0,1],
[0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,1,0,0,0,0,0,0,1,0,1,0,0,0,0,3,1,0,0,0,2,0,2,1,0,0,1,2,1,0,1,1,0,0,3,0,0,0,0,0,0,0,0,0,0,0,1,3,1,0,0,0,0,0,1,0,0,2,1,0,0,0,0,0,0,0,0,2],
[0,4,0,4,0,4,0,3,0,4,4,3,4,2,4,3,2,0,4,4,4,3,5,3,5,3,3,2,4,2,4,3,4,3,1,4,0,2,3,4,4,4,3,3,3,4,4,4,3,4,1,3,4,3,2,1,2,1,3,3,3,4,4,3,3,5,0,4,0,3,0,4,3,3,3,2,1,0,3,0,0,3,3],
[0,4,0,3,0,3,0,3,0,3,5,5,3,3,3,3,4,3,4,3,3,3,4,4,4,3,3,3,3,4,3,5,3,3,1,3,2,4,5,5,5,5,4,3,4,5,5,3,2,2,3,3,3,3,2,3,3,1,2,3,2,4,3,3,3,4,0,4,0,2,0,4,3,2,2,1,2,0,3,0,0,4,1]
];

jschardet.JapaneseContextAnalysis = function() {
    var NUM_OF_CATEGORY = 6;
    var DONT_KNOW = -1;
    var ENOUGH_REL_THRESHOLD = 100;
    var MAX_REL_THRESHOLD = 1000;
    var MINIMUM_DATA_THRESHOLD = 4;
    var self = this;

    function init() {
        self.reset();
    }

    this.reset = function() {
        this._mTotalRel = 0; // total sequence received
        this._mRelSample = []; // category counters, each interger counts sequence in its category
        for( var i = 0; i < NUM_OF_CATEGORY; this._mRelSample[i++] = 0 );
        this._mNeedToSkipCharNum = 0; // if last byte in current buffer is not the last byte of a character, we need to know how many bytes to skip in next buffer
        this._mLastCharOrder = -1; // The order of previous char
        this._mDone = false; // If this flag is set to true, detection is done and conclusion has been made
    }

    this.feed = function(aBuf, aLen) {
        if( this._mDone ) return;

        // The buffer we got is byte oriented, and a character may span in more than one
        // buffers. In case the last one or two byte in last buffer is not complete, we
        // record how many byte needed to complete that character and skip these bytes here.
        // We can choose to record those bytes as well and analyse the character once it
        // is complete, but since a character will not make much difference, by simply skipping
        // this character will simply our logic and improve performance.
        var i = this._mNeedToSkipCharNum;
        while( i < aLen ) {
            var rets = this.getOrder(aBuf.slice(i,i+2));
            var order = rets[0];
            var charLen = rets[1];
            i += charLen;
            if( i > aLen ) {
                this._mNeedToSkipCharNum = i - aLen;
                this._mLastCharOrder = -1;
            } else {
                if( order != -1 && this._mLastCharOrder != -1 ) {
                    this._mTotalRel += 1;
                    if( this._mTotalRel > MAX_REL_THRESHOLD ) {
                        this._mDone = true;
                        break;
                    }
                    this._mRelSample[jschardet.jp2CharContext[this._mLastCharOrder][order]] += 1;
                }
                this._mLastCharOrder = order;
            }
        }
    }

    this.gotEnoughData = function() {
        return this._mTotalRel > ENOUGH_REL_THRESHOLD;
    }

    this.getConfidence = function() {
        // This is just one way to calculate confidence. It works well for me.
        if( this._mTotalRel > MINIMUM_DATA_THRESHOLD ) {
            return (this._mTotalRel - this._mRelSample[0]) / this._mTotalRel;
        } else {
            return DONT_KNOW;
        }
    }

    this.getOrder = function(aStr) {
        return [-1, 1];
    }

    init();
}

jschardet.SJISContextAnalysis = function() {
    this.getOrder = function(aStr) {
        if( !aStr ) return [-1, 1];
        // find out current char's byte length
        if( (aStr.charCodeAt(0) >= 0x81 && aStr.charCodeAt(0) <= 0x9F) ||
            (aStr.charCodeAt(0) >= 0xE0 && aStr.charCodeAt(0) <= 0xFC) ) {
            var charLen = 2;
        } else {
            charLen = 1;
        }

        // return its order if it is hiragana
        if( aStr.length > 1 ) {
            if( aStr.charCodeAt(0) == 0x82 && aStr.charCodeAt(1) >= 0x9F &&
                aStr.charCodeAt(0) <= 0xF1 ) {
                return [aStr.charCodeAt(1) - 0x9F, charLen];
            }
        }

        return [-1, charLen];
    }
}
jschardet.SJISContextAnalysis.prototype = new jschardet.JapaneseContextAnalysis();

jschardet.EUCJPContextAnalysis = function() {
    this.getOrder = function(aStr) {
        if( !aStr ) return [-1, 1];
        // find out current char's byte length
        if( aStr.charCodeAt(0) >= 0x8E ||
            (aStr.charCodeAt(0) >= 0xA1 && aStr.charCodeAt(0) <= 0xFE) ) {
            var charLen = 2;
        } else if( aStr.charCodeAt(0) == 0x8F ) {
            charLen = 3;
        } else {
            charLen = 1;
        }

        // return its order if it is hiragana
        if( aStr.length > 1 ) {
            if( aStr.charCodeAt(0) == 0xA4 && aStr.charCodeAt(1) >= 0xA1 &&
                aStr.charCodeAt(1) <= 0xF3 ) {
                return [aStr.charCodeAt(1) - 0xA1, charLen];
            }
        }

        return [-1, charLen];
    }
}
jschardet.EUCJPContextAnalysis.prototype = new jschardet.JapaneseContextAnalysis();

/*
 * The Original Code is Mozilla Universal charset detector code.
 *
 * The Initial Developer of the Original Code is
 * Netscape Communications Corporation.
 * Portions created by the Initial Developer are Copyright (C) 2001
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   António Afonso (antonio.afonso gmail.com) - port to JavaScript
 *   Mark Pilgrim - port to Python
 *   Shy Shalom - original C code
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301  USA
 */

jschardet.SJISProber = function() {
    jschardet.MultiByteCharSetProber.apply(this);

    var self = this;

    function init() {
        self._mCodingSM = new jschardet.CodingStateMachine(jschardet.SJISSMModel);
        self._mDistributionAnalyzer = new jschardet.SJISDistributionAnalysis();
        self._mContextAnalyzer = new jschardet.SJISContextAnalysis();
        self.reset();
    }

    this.reset = function() {
        jschardet.SJISProber.prototype.reset.apply(this);
        this._mContextAnalyzer.reset();
    }

    this.getCharsetName = function() {
        return "SHIFT_JIS";
    }

    this.feed = function(aBuf) {
        var aLen = aBuf.length;
        for( var i = 0; i < aLen; i++ ) {
            var codingState = this._mCodingSM.nextState(aBuf[i]);
            if( codingState == jschardet.Constants.error ) {
                if( jschardet.Constants._debug ) {
                    console.log(this.getCharsetName() + " prober hit error at byte " + i + "\n");
                }
                this._mState = jschardet.Constants.notMe;
                break;
            } else if( codingState == jschardet.Constants.itsMe ) {
                this._mState = jschardet.Constants.foundIt;
                break;
            } else if( codingState == jschardet.Constants.start ) {
                var charLen = this._mCodingSM.getCurrentCharLen();
                if( i == 0 ) {
                    this._mLastChar[1] = aBuf[0];
                    this._mContextAnalyzer.feed(this._mLastChar.slice(2 - charLen), charLen);
                    this._mDistributionAnalyzer.feed(this._mLastChar, charLen);
                } else {
                    this._mContextAnalyzer.feed(aBuf.slice(i + 1 - charLen, i + 3 - charLen), charLen);
                    this._mDistributionAnalyzer.feed(aBuf.slice(i - 1, i + 1), charLen);
                }
            }
        }

        this._mLastChar[0] = aBuf[aLen - 1];

        if( this.getState() == jschardet.Constants.detecting ) {
            if( this._mContextAnalyzer.gotEnoughData() &&
                this.getConfidence() > jschardet.Constants.SHORTCUT_THRESHOLD ) {
                this._mState = jschardet.Constants.foundIt;
            }
        }

        return this.getState();
    }

    this.getConfidence = function() {
        var contxtCf = this._mContextAnalyzer.getConfidence();
        var distribCf = this._mDistributionAnalyzer.getConfidence();
        return Math.max(contxtCf, distribCf);
    }

    init();
}
jschardet.SJISProber.prototype = new jschardet.MultiByteCharSetProber();
/*
 * The Original Code is Mozilla Universal charset detector code.
 *
 * The Initial Developer of the Original Code is
 * Netscape Communications Corporation.
 * Portions created by the Initial Developer are Copyright (C) 2001
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   António Afonso (antonio.afonso gmail.com) - port to JavaScript
 *   Mark Pilgrim - port to Python
 *   Shy Shalom - original C code
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301  USA
 */

jschardet.UTF8Prober = function() {
    jschardet.CharSetProber.apply(this);

    var ONE_CHAR_PROB = 0.5;
    var self = this;

    function init() {
        self._mCodingSM = new jschardet.CodingStateMachine(jschardet.UTF8SMModel);
        self.reset();
    }

    this.reset = function() {
        jschardet.UTF8Prober.prototype.reset.apply(this);
        this._mCodingSM.reset();
        this._mNumOfMBChar = 0;
    }

    this.getCharsetName = function() {
        return "utf-8";
    }

    this.feed = function(aBuf) {
        for( var i = 0, c; i < aBuf.length; i++ ) {
            c = aBuf[i];
            var codingState = this._mCodingSM.nextState(c);
            if( codingState == jschardet.Constants.error ) {
                this._mState = jschardet.Constants.notMe;
                break;
            } else if( codingState == jschardet.Constants.itsMe ) {
                this._mState = jschardet.Constants.foundIt;
                break;
            } else if( codingState == jschardet.Constants.start ) {
                if( this._mCodingSM.getCurrentCharLen() >= 2 ) {
                    this._mNumOfMBChar++;
                }
            }
        }

        if( this.getState() == jschardet.Constants.detecting ) {
            if( this.getConfidence() > jschardet.Constants.SHORTCUT_THRESHOLD ) {
                this._mState = jschardet.Constants.foundIt;
            }
        }

        return this.getState();
    }

    this.getConfidence = function() {
        var unlike = 0.99;
        if( this._mNumOfMBChar < 6 ) {
            for( var i = 0; i < this._mNumOfMBChar; i++ ) {
                unlike *= ONE_CHAR_PROB;
            }
            return 1 - unlike;
        } else {
            return unlike;
        }
    }

    init();
}
jschardet.UTF8Prober.prototype = new jschardet.CharSetProber();

/*
 * The Original Code is Mozilla Universal charset detector code.
 *
 * The Initial Developer of the Original Code is
 * Netscape Communications Corporation.
 * Portions created by the Initial Developer are Copyright (C) 2001
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   António Afonso (antonio.afonso gmail.com) - port to JavaScript
 *   Mark Pilgrim - port to Python
 *   Shy Shalom - original C code
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301  USA
 */

jschardet.CharSetGroupProber = function() {
    jschardet.CharSetProber.apply(this);

    var self = this;

    function init() {
        self._mActiveNum = 0;
        self._mProbers = [];
        self._mBestGuessProber = null;
    }

    this.reset = function() {
        jschardet.CharSetGroupProber.prototype.reset.apply(this);
        this._mActiveNum = 0;
        for( var i = 0, prober; prober = this._mProbers[i]; i++ ) {
            if( prober ) {
                prober.reset();
                prober.active = true;
                this._mActiveNum++;
            }
        }
        this._mBestGuessProber = null;
    }

    this.getCharsetName = function() {
        if( !this._mBestGuessProber ) {
            this.getConfidence();
            if( !this._mBestGuessProber ) return null;
        }
        return this._mBestGuessProber.getCharsetName();
    }

    this.feed = function(aBuf) {
        for( var i = 0, prober; prober = this._mProbers[i]; i++ ) {
            if( !prober || !prober.active ) continue;
            var st = prober.feed(aBuf);
            if( !st ) continue;
            if( st == jschardet.Constants.foundIt ) {
                this._mBestGuessProber = prober;
                return this.getState();
            } else if( st == jschardet.Constants.notMe ) {
                prober.active = false;
                this._mActiveNum--;
                if( this._mActiveNum <= 0 ) {
                    this._mState = jschardet.Constants.notMe;
                    return this.getState();
                }
            }
        }
        return this.getState();
    }

    this.getConfidence = function() {
        var st = this.getState();
        if( st == jschardet.Constants.foundIt ) {
            return 0.99;
        } else if( st == jschardet.Constants.notMe ) {
            return 0.01;
        }
        var bestConf = 0.0;
        this._mBestGuessProber = null;
        for( var i = 0, prober; prober = this._mProbers[i]; i++ ) {
            if( !prober ) continue;
            if( !prober.active ) {
                if( jschardet.Constants._debug ) {
                    console.log(prober.getCharsetName() + " not active\n");
                }
                continue;
            }
            var cf = prober.getConfidence();
            if( jschardet.Constants._debug ) {
                console.log(prober.getCharsetName() + " confidence = " + cf + "\n");
            }
            if( bestConf < cf ) {
                bestConf = cf;
                this._mBestGuessProber = prober;
            }
        }
        if( !this._mBestGuessProber ) return 0.0;
        return bestConf;
    }

    init();
}
jschardet.CharSetGroupProber.prototype = new jschardet.CharSetProber();

/*
 * The Original Code is Mozilla Universal charset detector code.
 *
 * The Initial Developer of the Original Code is
 * Netscape Communications Corporation.
 * Portions created by the Initial Developer are Copyright (C) 2001
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   António Afonso (antonio.afonso gmail.com) - port to JavaScript
 *   Mark Pilgrim - port to Python
 *   Shy Shalom - original C code
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301  USA
 */

jschardet.EUCJPProber = function() {
    jschardet.MultiByteCharSetProber.apply(this);

    var self = this;

    function init() {
        self._mCodingSM = new jschardet.CodingStateMachine(jschardet.EUCJPSMModel);
        self._mDistributionAnalyzer = new jschardet.EUCJPDistributionAnalysis();
        self._mContextAnalyzer = new jschardet.EUCJPContextAnalysis();
        self.reset();
    }

    this.reset = function() {
        jschardet.EUCJPProber.prototype.reset.apply(this);
        this._mContextAnalyzer.reset();
    }

    this.getCharsetName = function() {
        return "EUC-JP";
    }

    this.feed = function(aBuf) {
        var aLen = aBuf.length;
        for( var i = 0; i < aLen; i++ ) {
            var codingState = this._mCodingSM.nextState(aBuf[i]);
            if( codingState == jschardet.Constants.error ) {
                if( jschardet.Constants._debug ) {
                    console.log(this.getCharsetName() + " prober hit error at byte " + i + "\n");
                }
                this._mState = jschardet.Constants.notMe;
                break;
            } else if( codingState == jschardet.Constants.itsMe ) {
                this._mState = jschardet.Constants.foundIt;
                break;
            } else if( codingState == jschardet.Constants.start ) {
                var charLen = this._mCodingSM.getCurrentCharLen();
                if( i == 0 ) {
                    this._mLastChar[1] = aBuf[0];
                    this._mContextAnalyzer.feed(this._mLastChar, charLen);
                    this._mDistributionAnalyzer.feed(this._mLastChar, charLen);
                } else {
                    this._mContextAnalyzer.feed(aBuf.slice(i-1,i+1), charLen);
                    this._mDistributionAnalyzer.feed(aBuf.slice(i-1,i+1), charLen);
                }
            }
        }

        this._mLastChar[0] = aBuf[aLen - 1];

        if( this.getState() == jschardet.Constants.detecting ) {
            if( this._mContextAnalyzer.gotEnoughData() &&
                this.getConfidence() > jschardet.Constants.SHORTCUT_THRESHOLD ) {
                this._mState = jschardet.Constants.foundIt;
            }
        }

        return this.getState();
    }

    this.getConfidence = function() {
        var contxtCf = this._mContextAnalyzer.getConfidence();
        var distribCf = this._mDistributionAnalyzer.getConfidence();

        return Math.max(contxtCf, distribCf);
    }

    init();
}
jschardet.EUCJPProber.prototype = new jschardet.MultiByteCharSetProber();
/*
 * The Original Code is Mozilla Universal charset detector code.
 *
 * The Initial Developer of the Original Code is
 * Netscape Communications Corporation.
 * Portions created by the Initial Developer are Copyright (C) 2001
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   António Afonso (antonio.afonso gmail.com) - port to JavaScript
 *   Mark Pilgrim - port to Python
 *   Shy Shalom - original C code
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301  USA
 */

jschardet.GB2312Prober = function() {
    jschardet.MultiByteCharSetProber.apply(this);

    var self = this;

    function init() {
        self._mCodingSM = new jschardet.CodingStateMachine(jschardet.GB2312SMModel);
        self._mDistributionAnalyzer = new jschardet.GB2312DistributionAnalysis();
        self.reset();
    }

    this.getCharsetName = function() {
        return "GB2312";
    }

    init();
}
jschardet.GB2312Prober.prototype = new jschardet.MultiByteCharSetProber();

/*
 * The Original Code is Mozilla Universal charset detector code.
 *
 * The Initial Developer of the Original Code is
 * Netscape Communications Corporation.
 * Portions created by the Initial Developer are Copyright (C) 2001
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   António Afonso (antonio.afonso gmail.com) - port to JavaScript
 *   Mark Pilgrim - port to Python
 *   Shy Shalom - original C code
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301  USA
 */

jschardet.EUCKRProber = function() {
    jschardet.MultiByteCharSetProber.apply(this);

    var self = this;

    function init() {
        self._mCodingSM = new jschardet.CodingStateMachine(jschardet.EUCKRSMModel);
        self._mDistributionAnalyzer = new jschardet.EUCKRDistributionAnalysis();
        self.reset();
    }

    this.getCharsetName = function() {
        return "EUC-KR";
    }

    init();
}
jschardet.EUCKRProber.prototype = new jschardet.MultiByteCharSetProber();

/*
 * The Original Code is Mozilla Universal charset detector code.
 *
 * The Initial Developer of the Original Code is
 * Netscape Communications Corporation.
 * Portions created by the Initial Developer are Copyright (C) 2001
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   António Afonso (antonio.afonso gmail.com) - port to JavaScript
 *   Mark Pilgrim - port to Python
 *   Shy Shalom - original C code
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301  USA
 */

jschardet.Big5Prober = function() {
    jschardet.MultiByteCharSetProber.apply(this);

    var self = this;

    function init() {
        self._mCodingSM = new jschardet.CodingStateMachine(jschardet.Big5SMModel);
        self._mDistributionAnalyzer = new jschardet.Big5DistributionAnalysis();
        self.reset();
    }

    this.getCharsetName = function() {
        return "Big5";
    }

    init();
}
jschardet.Big5Prober.prototype = new jschardet.MultiByteCharSetProber();

/*
 * The Original Code is Mozilla Universal charset detector code.
 *
 * The Initial Developer of the Original Code is
 * Netscape Communications Corporation.
 * Portions created by the Initial Developer are Copyright (C) 2001
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   António Afonso (antonio.afonso gmail.com) - port to JavaScript
 *   Mark Pilgrim - port to Python
 *   Shy Shalom - original C code
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301  USA
 */

jschardet.EUCTWProber = function() {
    jschardet.MultiByteCharSetProber.apply(this);

    var self = this;

    function init() {
        self._mCodingSM = new jschardet.CodingStateMachine(jschardet.EUCTWSMModel);
        self._mDistributionAnalyzer = new jschardet.EUCTWDistributionAnalysis();
        self.reset();
    }

    this.getCharsetName = function() {
        return "EUC-TW";
    }

    init();
}
jschardet.EUCTWProber.prototype = new jschardet.MultiByteCharSetProber();

/*
 * The Original Code is Mozilla Universal charset detector code.
 *
 * The Initial Developer of the Original Code is
 * Netscape Communications Corporation.
 * Portions created by the Initial Developer are Copyright (C) 2001
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   António Afonso (antonio.afonso gmail.com) - port to JavaScript
 *   Mark Pilgrim - port to Python
 *   Shy Shalom - original C code
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301  USA
 */

jschardet.MBCSGroupProber = function() {
    jschardet.CharSetGroupProber.apply(this);
    this._mProbers = [
        new jschardet.UTF8Prober(),
        new jschardet.SJISProber(),
        new jschardet.EUCJPProber(),
        new jschardet.GB2312Prober(),
        new jschardet.EUCKRProber(),
        new jschardet.Big5Prober(),
        new jschardet.EUCTWProber()
    ];
    this.reset();
}
jschardet.MBCSGroupProber.prototype = new jschardet.CharSetGroupProber();
/*
 * The Original Code is Mozilla Universal charset detector code.
 *
 * The Initial Developer of the Original Code is
 * Netscape Communications Corporation.
 * Portions created by the Initial Developer are Copyright (C) 2001
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   António Afonso (antonio.afonso gmail.com) - port to JavaScript
 *   Mark Pilgrim - port to Python
 *   Shy Shalom - original C code
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301  USA
 */

jschardet.SingleByteCharSetProber = function(model, reversed, nameProber) {
    jschardet.CharSetProber.apply(this);

    var SAMPLE_SIZE = 64;
    var SB_ENOUGH_REL_THRESHOLD = 1024;
    var POSITIVE_SHORTCUT_THRESHOLD = 0.95;
    var NEGATIVE_SHORTCUT_THRESHOLD = 0.05;
    var SYMBOL_CAT_ORDER = 250;
    var NUMBER_OF_SEQ_CAT = 4;
    var POSITIVE_CAT = NUMBER_OF_SEQ_CAT - 1;
    //var NEGATIVE_CAT = 0;

    var self = this;

    function init(model, reversed, nameProber) {
        self._mModel = model;
        self._mReversed = reversed; // "true" if we need to reverse every pair in the model lookup
        self._mNameProber = nameProber; // Optional auxiliary prober for name decision
        self.reset();
    }

    this.reset = function() {
        jschardet.SingleByteCharSetProber.prototype.reset.apply(this);
        this._mLastOrder = 255; // char order of last character
        this._mSeqCounters = [];
        for( var i = 0; i < NUMBER_OF_SEQ_CAT; this._mSeqCounters[i++] = 0 );
        this._mTotalSeqs = 0;
        this._mTotalChar = 0;
        this._mFreqChar = 0; // characters that fall in our sampling range
    }

    this.getCharsetName = function() {
        if( this._mNameProber ) {
            return this._mNameProber.getCharsetName();
        } else {
            return this._mModel.charsetName;
        }
    }

    this.feed = function(aBuf) {
        if( ! this._mModel.keepEnglishLetter ) {
            aBuf = this.filterWithoutEnglishLetters(aBuf);
        }
        var aLen = aBuf.length;
        if( !aLen ) {
            return this.getState();
        }
        for( var i = 0, c; i < aLen; i++ )
        {
            c = aBuf.charCodeAt(i);
            var order = this._mModel.charToOrderMap[c];
            if( order < SYMBOL_CAT_ORDER ) {
                this._mTotalChar++;
            }
            if( order < SAMPLE_SIZE ) {
                this._mFreqChar++;
                if( this._mLastOrder < SAMPLE_SIZE ) {
                    this._mTotalSeqs++;
                    if( !this._mReversed ) {
                        this._mSeqCounters[this._mModel.precedenceMatrix[(this._mLastOrder * SAMPLE_SIZE) + order]]++;
                    } else { // reverse the order of the letters in the lookup
                        this._mSeqCounters[this._mModel.precedenceMatrix[(order * SAMPLE_SIZE) + this._mLastOrder]]++;
                    }
                }
            }
            this._mLastOrder = order;
        }

        if( this.getState() == jschardet.Constants.detecting ) {
            if( self._mTotalSeqs > SB_ENOUGH_REL_THRESHOLD ) {
                var cf = this.getConfidence();
                if( cf > POSITIVE_SHORTCUT_THRESHOLD ) {
                    if( jschardet.Constants._debug ) {
                        console.log(this._mModel.charsetName + " confidence = " + cf + ", we have a winner\n");
                    }
                } else if( cf < NEGATIVE_SHORTCUT_THRESHOLD ) {
                    if( jschardet.Constants._debug ) {
                        console.log(this._mModel.charsetName + " confidence = " + cf + ", below negative shortcut threshhold " + NEGATIVE_SHORTCUT_THRESHOLD + "\n");
                    }
                    this._mState = jschardet.Constants.notMe;
                }
            }
        }

        return this.getState();
    }

    this.getConfidence = function() {
        var r = 0.01;
        if( this._mTotalSeqs > 0 ) {
            r = (1.0 * this._mSeqCounters[POSITIVE_CAT]) / this._mTotalSeqs / this._mModel.mTypicalPositiveRatio;
            r *= this._mFreqChar / this._mTotalChar;
            if( r >= 1.0 ) {
                r = 0.99;
            }
        }
        return r;
    }

    reversed = reversed !== undefined ? reversed : false;
    nameProber = nameProber !== undefined ? nameProber : null;
    init(model, reversed, nameProber);
}
jschardet.SingleByteCharSetProber.prototype = new jschardet.CharSetProber();

/*
 * The Original Code is Mozilla Universal charset detector code.
 *
 * The Initial Developer of the Original Code is
 * Netscape Communications Corporation.
 * Portions created by the Initial Developer are Copyright (C) 2001
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   António Afonso (antonio.afonso gmail.com) - port to JavaScript
 *   Mark Pilgrim - port to Python
 *   Shy Shalom - original C code
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301  USA
 */

// 255: Control characters that usually does not exist in any text
// 254: Carriage/Return
// 253: symbol (punctuation) that does not belong to word
// 252: 0 - 9

// Character Mapping Table:
jschardet.Latin7_CharToOrderMap = [
255,255,255,255,255,255,255,255,255,255,254,255,255,254,255,255,  // 00
255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,  // 10
253,253,253,253,253,253,253,253,253,253,253,253,253,253,253,253,  // 20
252,252,252,252,252,252,252,252,252,252,253,253,253,253,253,253,  // 30
253, 82,100,104, 94, 98,101,116,102,111,187,117, 92, 88,113, 85,  // 40
 79,118,105, 83, 67,114,119, 95, 99,109,188,253,253,253,253,253,  // 50
253, 72, 70, 80, 81, 60, 96, 93, 89, 68,120, 97, 77, 86, 69, 55,  // 60
 78,115, 65, 66, 58, 76,106,103, 87,107,112,253,253,253,253,253,  // 70
255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,  // 80
255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,  // 90
253,233, 90,253,253,253,253,253,253,253,253,253,253, 74,253,253,  // a0
253,253,253,253,247,248, 61, 36, 46, 71, 73,253, 54,253,108,123,  // b0
110, 31, 51, 43, 41, 34, 91, 40, 52, 47, 44, 53, 38, 49, 59, 39,  // c0
 35, 48,250, 37, 33, 45, 56, 50, 84, 57,120,121, 17, 18, 22, 15,  // d0
124,  1, 29, 20, 21,  3, 32, 13, 25,  5, 11, 16, 10,  6, 30,  4,  // e0
  9,  8, 14,  7,  2, 12, 28, 23, 42, 24, 64, 75, 19, 26, 27,253   // f0
];

jschardet.win1253_CharToOrderMap = [
255,255,255,255,255,255,255,255,255,255,254,255,255,254,255,255,  // 00
255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,  // 10
253,253,253,253,253,253,253,253,253,253,253,253,253,253,253,253,  // 20
252,252,252,252,252,252,252,252,252,252,253,253,253,253,253,253,  // 30
253, 82,100,104, 94, 98,101,116,102,111,187,117, 92, 88,113, 85,  // 40
 79,118,105, 83, 67,114,119, 95, 99,109,188,253,253,253,253,253,  // 50
253, 72, 70, 80, 81, 60, 96, 93, 89, 68,120, 97, 77, 86, 69, 55,  // 60
 78,115, 65, 66, 58, 76,106,103, 87,107,112,253,253,253,253,253,  // 70
255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,  // 80
255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,  // 90
253,233, 61,253,253,253,253,253,253,253,253,253,253, 74,253,253,  // a0
253,253,253,253,247,253,253, 36, 46, 71, 73,253, 54,253,108,123,  // b0
110, 31, 51, 43, 41, 34, 91, 40, 52, 47, 44, 53, 38, 49, 59, 39,  // c0
 35, 48,250, 37, 33, 45, 56, 50, 84, 57,120,121, 17, 18, 22, 15,  // d0
124,  1, 29, 20, 21,  3, 32, 13, 25,  5, 11, 16, 10,  6, 30,  4,  // e0
  9,  8, 14,  7,  2, 12, 28, 23, 42, 24, 64, 75, 19, 26, 27,253   // f0
]

// Model Table:
// total sequences: 100%
// first 512 sequences: 98.2851%
// first 1024 sequences:1.7001%
// rest  sequences:     0.0359%
// negative sequences:  0.0148%
jschardet.GreekLangModel = [
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,3,2,2,3,3,3,3,3,3,3,3,1,3,3,3,0,2,2,3,3,0,3,0,3,2,0,3,3,3,0,
3,0,0,0,2,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,3,3,3,3,3,0,3,3,0,3,2,3,3,0,3,2,3,3,3,0,0,3,0,3,0,3,3,2,0,0,0,
2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,
0,2,3,2,2,3,3,3,3,3,3,3,3,0,3,3,3,3,0,2,3,3,0,3,3,3,3,2,3,3,3,0,
2,0,0,0,2,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,2,3,3,2,3,3,3,3,3,3,3,3,3,3,3,3,0,2,1,3,3,3,3,2,3,3,2,3,3,2,0,
0,0,0,0,2,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,3,3,3,3,0,3,3,3,3,3,3,0,3,3,0,3,3,3,3,3,3,3,3,3,3,0,3,2,3,3,0,
2,0,1,0,2,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,
0,3,3,3,3,3,2,3,0,0,0,0,3,3,0,3,1,3,3,3,0,3,3,0,3,3,3,3,0,0,0,0,
2,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,3,3,3,3,3,0,3,0,3,3,3,3,3,0,3,2,2,2,3,0,2,3,3,3,3,3,2,3,3,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,3,3,3,3,3,3,2,2,2,3,3,3,3,0,3,1,3,3,3,3,2,3,3,3,3,3,3,3,2,2,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,3,3,3,3,3,2,0,3,0,0,0,3,3,2,3,3,3,3,3,0,0,3,2,3,0,2,3,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,3,0,3,3,3,3,0,0,3,3,0,2,3,0,3,0,3,3,3,0,0,3,0,3,0,2,2,3,3,0,0,
0,0,1,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,3,3,3,3,3,2,0,3,2,3,3,3,3,0,3,3,3,3,3,0,3,3,2,3,2,3,3,2,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,3,3,2,3,2,3,3,3,3,3,3,0,2,3,2,3,2,2,2,3,2,3,3,2,3,0,2,2,2,3,0,
2,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,3,0,0,0,3,3,3,2,3,3,0,0,3,0,3,0,0,0,3,2,0,3,0,3,0,0,2,0,2,0,
0,0,0,0,2,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,3,3,3,3,0,3,3,3,3,3,3,0,3,3,0,3,0,0,0,3,3,0,3,3,3,0,0,1,2,3,0,
3,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,3,3,3,3,3,2,0,0,3,2,2,3,3,0,3,3,3,3,3,2,1,3,0,3,2,3,3,2,1,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,3,3,0,2,3,3,3,3,3,3,0,0,3,0,3,0,0,0,3,3,0,3,2,3,0,0,3,3,3,0,
3,0,0,0,2,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,3,3,3,3,0,3,3,3,3,3,3,0,0,3,0,3,0,0,0,3,2,0,3,2,3,0,0,3,2,3,0,
2,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,3,1,2,2,3,3,3,3,3,3,0,2,3,0,3,0,0,0,3,3,0,3,0,2,0,0,2,3,1,0,
2,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,3,0,3,3,3,3,0,3,0,3,3,2,3,0,3,3,3,3,3,3,0,3,3,3,0,2,3,0,0,3,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,3,0,3,3,3,0,0,3,0,0,0,3,3,0,3,0,2,3,3,0,0,3,0,3,0,3,3,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,3,0,0,0,3,3,3,3,3,3,0,0,3,0,2,0,0,0,3,3,0,3,0,3,0,0,2,0,2,0,
0,0,0,0,1,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,3,3,3,3,3,3,0,3,0,2,0,3,2,0,3,2,3,2,3,0,0,3,2,3,2,3,3,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,3,0,0,2,3,3,3,3,3,0,0,0,3,0,2,1,0,0,3,2,2,2,0,3,0,0,2,2,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,3,0,3,3,3,2,0,3,0,3,0,3,3,0,2,1,2,3,3,0,0,3,0,3,0,3,3,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,2,3,3,3,0,3,3,3,3,3,3,0,2,3,0,3,0,0,0,2,1,0,2,2,3,0,0,2,2,2,0,
0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,3,0,0,2,3,3,3,2,3,0,0,1,3,0,2,0,0,0,0,3,0,1,0,2,0,0,1,1,1,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,3,3,3,3,3,1,0,3,0,0,0,3,2,0,3,2,3,3,3,0,0,3,0,3,2,2,2,1,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,3,0,3,3,3,0,0,3,0,0,0,0,2,0,2,3,3,2,2,2,2,3,0,2,0,2,2,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,3,3,3,3,2,0,0,0,0,0,0,2,3,0,2,0,2,3,2,0,0,3,0,3,0,3,1,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,3,2,3,3,2,2,3,0,2,0,3,0,0,0,2,0,0,0,0,1,2,0,2,0,2,0,
0,2,0,2,0,2,2,0,0,1,0,2,2,2,0,2,2,2,0,2,2,2,0,0,2,0,0,1,0,0,0,0,
0,2,0,3,3,2,0,0,0,0,0,0,1,3,0,2,0,2,2,2,0,0,2,0,3,0,0,2,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,3,0,2,3,2,0,2,2,0,2,0,2,2,0,2,0,2,2,2,0,0,0,0,0,0,2,3,0,0,0,2,
0,1,2,0,0,0,0,2,2,0,0,0,2,1,0,2,2,0,0,0,0,0,0,1,0,2,0,0,0,0,0,0,
0,0,2,1,0,2,3,2,2,3,2,3,2,0,0,3,3,3,0,0,3,2,0,0,0,1,1,0,2,0,2,2,
0,2,0,2,0,2,2,0,0,2,0,2,2,2,0,2,2,2,2,0,0,2,0,0,0,2,0,1,0,0,0,0,
0,3,0,3,3,2,2,0,3,0,0,0,2,2,0,2,2,2,1,2,0,0,1,2,2,0,0,3,0,0,0,2,
0,1,2,0,0,0,1,2,0,0,0,0,0,0,0,2,2,0,1,0,0,2,0,0,0,2,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,2,3,3,2,2,0,0,0,2,0,2,3,3,0,2,0,0,0,0,0,0,2,2,2,0,2,2,0,2,0,2,
0,2,2,0,0,2,2,2,2,1,0,0,2,2,0,2,0,0,2,0,0,0,0,0,0,2,0,0,0,0,0,0,
0,2,0,3,2,3,0,0,0,3,0,0,2,2,0,2,0,2,2,2,0,0,2,0,0,0,0,0,0,0,0,2,
0,0,2,2,0,0,2,2,2,0,0,0,0,0,0,2,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,2,0,0,3,2,0,2,2,2,2,2,0,0,0,2,0,0,0,0,2,0,1,0,0,2,0,1,0,0,0,
0,2,2,2,0,2,2,0,1,2,0,2,2,2,0,2,2,2,2,1,2,2,0,0,2,0,0,0,0,0,0,0,
0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,
0,2,0,2,0,2,2,0,0,0,0,1,2,1,0,0,2,2,0,0,2,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,3,2,3,0,0,2,0,0,0,2,2,0,2,0,0,0,1,0,0,2,0,2,0,2,2,0,0,0,0,
0,0,2,0,0,0,0,2,2,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,
0,2,2,3,2,2,0,0,0,0,0,0,1,3,0,2,0,2,2,0,0,0,1,0,2,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,2,0,2,0,3,2,0,2,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
0,0,2,0,0,0,0,1,1,0,0,2,1,2,0,2,2,0,1,0,0,1,0,0,0,2,0,0,0,0,0,0,
0,3,0,2,2,2,0,0,2,0,0,0,2,0,0,0,2,3,0,2,0,0,0,0,0,0,2,2,0,0,0,2,
0,1,2,0,0,0,1,2,2,1,0,0,0,2,0,0,2,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,2,1,2,0,2,2,0,2,0,0,2,0,0,0,0,1,2,1,0,2,1,0,0,0,0,0,0,0,0,0,0,
0,0,2,0,0,0,3,1,2,2,0,2,0,0,0,0,2,0,0,0,2,0,0,3,0,0,0,0,2,2,2,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,2,1,0,2,0,1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,1,0,0,0,0,0,0,2,
0,2,2,0,0,2,2,2,2,2,0,1,2,0,0,0,2,2,0,1,0,2,0,0,2,2,0,0,0,0,0,0,
0,0,0,0,1,0,0,0,0,0,0,0,3,0,0,2,0,0,0,0,0,0,0,0,2,0,2,0,0,0,0,2,
0,1,2,0,0,0,0,2,2,1,0,1,0,1,0,2,2,2,1,0,0,0,0,0,0,1,0,0,0,0,0,0,
0,2,0,1,2,0,0,0,0,0,0,0,0,0,0,2,0,0,2,2,0,0,0,0,1,0,0,0,0,0,0,2,
0,2,2,0,0,0,0,2,2,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,2,0,0,2,0,0,0,
0,2,2,2,2,0,0,0,3,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,2,0,0,0,0,0,0,1,
0,0,2,0,0,0,0,1,2,0,0,0,0,0,0,2,2,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,
0,2,0,2,2,2,0,0,2,0,0,0,0,0,0,0,2,2,2,0,0,0,2,0,0,0,0,0,0,0,0,2,
0,0,1,0,0,0,0,2,1,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,
0,3,0,2,0,0,0,0,0,0,0,0,2,0,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,2,
0,0,2,0,0,0,0,2,2,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,2,0,2,2,1,0,0,0,0,0,0,2,0,0,2,0,2,2,2,0,0,0,0,0,0,2,0,0,0,0,2,
0,0,2,0,0,2,0,2,2,0,0,0,0,2,0,2,0,0,0,0,0,2,0,0,0,2,0,0,0,0,0,0,
0,0,3,0,0,0,2,2,0,2,2,0,0,0,0,0,2,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,
0,2,2,2,2,2,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1,
0,0,0,0,0,0,0,2,1,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,2,2,0,0,0,0,0,2,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,
0,2,0,0,0,2,0,0,0,0,0,1,0,0,0,0,2,2,0,0,0,1,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,2,0,0,0,
0,2,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,2,0,2,0,0,0,
0,0,0,0,0,0,0,0,2,1,0,0,0,0,0,0,2,0,0,0,1,2,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
];

jschardet.Latin7GreekModel = {
    "charToOrderMap"        : jschardet.Latin7_CharToOrderMap,
    "precedenceMatrix"      : jschardet.GreekLangModel,
    "mTypicalPositiveRatio" : 0.982851,
    "keepEnglishLetter"     : false,
    "charsetName"           : "ISO-8859-7"
};

jschardet.Win1253GreekModel = {
    "charToOrderMap"        : jschardet.win1253_CharToOrderMap,
    "precedenceMatrix"      : jschardet.GreekLangModel,
    "mTypicalPositiveRatio" : 0.982851,
    "keepEnglishLetter"     : false,
    "charsetName"           : "windows-1253"
};

/*
 * The Original Code is Mozilla Universal charset detector code.
 *
 * The Initial Developer of the Original Code is
 * Netscape Communications Corporation.
 * Portions created by the Initial Developer are Copyright (C) 2001
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   António Afonso (antonio.afonso gmail.com) - port to JavaScript
 *   Mark Pilgrim - port to Python
 *   Shy Shalom - original C code
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301  USA
 */

// 255: Control characters that usually does not exist in any text
// 254: Carriage/Return
// 253: symbol (punctuation) that does not belong to word
// 252: 0 - 9

// The following result for thai was collected from a limited sample (1M).

// Character Mapping Table:
jschardet.TIS620CharToOrderMap = [
255,255,255,255,255,255,255,255,255,255,254,255,255,254,255,255,  // 00
255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,  // 10
253,253,253,253,253,253,253,253,253,253,253,253,253,253,253,253,  // 20
252,252,252,252,252,252,252,252,252,252,253,253,253,253,253,253,  // 30
253,182,106,107,100,183,184,185,101, 94,186,187,108,109,110,111,  // 40
188,189,190, 89, 95,112,113,191,192,193,194,253,253,253,253,253,  // 50
253, 64, 72, 73,114, 74,115,116,102, 81,201,117, 90,103, 78, 82,  // 60
 96,202, 91, 79, 84,104,105, 97, 98, 92,203,253,253,253,253,253,  // 70
209,210,211,212,213, 88,214,215,216,217,218,219,220,118,221,222,
223,224, 99, 85, 83,225,226,227,228,229,230,231,232,233,234,235,
236,  5, 30,237, 24,238, 75,  8, 26, 52, 34, 51,119, 47, 58, 57,
 49, 53, 55, 43, 20, 19, 44, 14, 48,  3, 17, 25, 39, 62, 31, 54,
 45,  9, 16,  2, 61, 15,239, 12, 42, 46, 18, 21, 76,  4, 66, 63,
 22, 10,  1, 36, 23, 13, 40, 27, 32, 35, 86,240,241,242,243,244,
 11, 28, 41, 29, 33,245, 50, 37,  6,  7, 67, 77, 38, 93,246,247,
 68, 56, 59, 65, 69, 60, 70, 80, 71, 87,248,249,250,251,252,253
];

// Model Table:
// total sequences: 100%
// first 512 sequences: 92.6386%
// first 1024 sequences:7.3177%
// rest  sequences:     1.0230%
// negative sequences:  0.0436%
jschardet.ThaiLangModel = [
0,1,3,3,3,3,0,0,3,3,0,3,3,0,3,3,3,3,3,3,3,3,0,0,3,3,3,0,3,3,3,3,
0,3,3,0,0,0,1,3,0,3,3,2,3,3,0,1,2,3,3,3,3,0,2,0,2,0,0,3,2,1,2,2,
3,0,3,3,2,3,0,0,3,3,0,3,3,0,3,3,3,3,3,3,3,3,3,0,3,2,3,0,2,2,2,3,
0,2,3,0,0,0,0,1,0,1,2,3,1,1,3,2,2,0,1,1,0,0,1,0,0,0,0,0,0,0,1,1,
3,3,3,2,3,3,3,3,3,3,3,3,3,3,3,2,2,2,2,2,2,2,3,3,2,3,2,3,3,2,2,2,
3,1,2,3,0,3,3,2,2,1,2,3,3,1,2,0,1,3,0,1,0,0,1,0,0,0,0,0,0,0,1,1,
3,3,2,2,3,3,3,3,1,2,3,3,3,3,3,2,2,2,2,3,3,2,2,3,3,2,2,3,2,3,2,2,
3,3,1,2,3,1,2,2,3,3,1,0,2,1,0,0,3,1,2,1,0,0,1,0,0,0,0,0,0,1,0,1,
3,3,3,3,3,3,2,2,3,3,3,3,2,3,2,2,3,3,2,2,3,2,2,2,2,1,1,3,1,2,1,1,
3,2,1,0,2,1,0,1,0,1,1,0,1,1,0,0,1,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,
3,3,3,2,3,2,3,3,2,2,3,2,3,3,2,3,1,1,2,3,2,2,2,3,2,2,2,2,2,1,2,1,
2,2,1,1,3,3,2,1,0,1,2,2,0,1,3,0,0,0,1,1,0,0,0,0,0,2,3,0,0,2,1,1,
3,3,2,3,3,2,0,0,3,3,0,3,3,0,2,2,3,1,2,2,1,1,1,0,2,2,2,0,2,2,1,1,
0,2,1,0,2,0,0,2,0,1,0,0,1,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,0,
3,3,2,3,3,2,0,0,3,3,0,2,3,0,2,1,2,2,2,2,1,2,0,0,2,2,2,0,2,2,1,1,
0,2,1,0,2,0,0,2,0,1,1,0,1,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,
3,3,2,3,2,3,2,0,2,2,1,3,2,1,3,2,1,2,3,2,2,3,0,2,3,2,2,1,2,2,2,2,
1,2,2,0,0,0,0,2,0,1,2,0,1,1,1,0,1,0,3,1,1,0,0,0,0,0,0,0,0,0,1,0,
3,3,2,3,3,2,3,2,2,2,3,2,2,3,2,2,1,2,3,2,2,3,1,3,2,2,2,3,2,2,2,3,
3,2,1,3,0,1,1,1,0,2,1,1,1,1,1,0,1,0,1,1,0,0,0,0,0,0,0,0,0,2,0,0,
1,0,0,3,0,3,3,3,3,3,0,0,3,0,2,2,3,3,3,3,3,0,0,0,1,1,3,0,0,0,0,2,
0,0,1,0,0,0,0,0,0,0,2,3,0,0,0,3,0,2,0,0,0,0,0,3,0,0,0,0,0,0,0,0,
2,0,3,3,3,3,0,0,2,3,0,0,3,0,3,3,2,3,3,3,3,3,0,0,3,3,3,0,0,0,3,3,
0,0,3,0,0,0,0,2,0,0,2,1,1,3,0,0,1,0,0,2,3,0,1,0,0,0,0,0,0,0,1,0,
3,3,3,3,2,3,3,3,3,3,3,3,1,2,1,3,3,2,2,1,2,2,2,3,1,1,2,0,2,1,2,1,
2,2,1,0,0,0,1,1,0,1,0,1,1,0,0,0,0,0,1,1,0,0,1,0,0,0,0,0,0,0,0,0,
3,0,2,1,2,3,3,3,0,2,0,2,2,0,2,1,3,2,2,1,2,1,0,0,2,2,1,0,2,1,2,2,
0,1,1,0,0,0,0,1,0,1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,
3,3,3,3,2,1,3,3,1,1,3,0,2,3,1,1,3,2,1,1,2,0,2,2,3,2,1,1,1,1,1,2,
3,0,0,1,3,1,2,1,2,0,3,0,0,0,1,0,3,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,
3,3,1,1,3,2,3,3,3,1,3,2,1,3,2,1,3,2,2,2,2,1,3,3,1,2,1,3,1,2,3,0,
2,1,1,3,2,2,2,1,2,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,
3,3,2,3,2,3,3,2,3,2,3,2,3,3,2,1,0,3,2,2,2,1,2,2,2,1,2,2,1,2,1,1,
2,2,2,3,0,1,3,1,1,1,1,0,1,1,0,2,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,
3,3,3,3,2,3,2,2,1,1,3,2,3,2,3,2,0,3,2,2,1,2,0,2,2,2,1,2,2,2,2,1,
3,2,1,2,2,1,0,2,0,1,0,0,1,1,0,0,0,0,0,1,1,0,1,0,0,0,0,0,0,0,0,1,
3,3,3,3,3,2,3,1,2,3,3,2,2,3,0,1,1,2,0,3,3,2,2,3,0,1,1,3,0,0,0,0,
3,1,0,3,3,0,2,0,2,1,0,0,3,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
3,3,3,2,3,2,3,3,0,1,3,1,1,2,1,2,1,1,3,1,1,0,2,3,1,1,1,1,1,1,1,1,
3,1,1,2,2,2,2,1,1,1,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
3,2,2,1,1,2,1,3,3,2,3,2,2,3,2,2,3,1,2,2,1,2,0,3,2,1,2,2,2,2,2,1,
3,2,1,2,2,2,1,1,1,1,0,0,1,1,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,
3,3,3,3,3,3,3,3,1,3,3,0,2,1,0,3,2,0,0,3,1,0,1,1,0,1,0,0,0,0,0,1,
1,0,0,1,0,3,2,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
3,0,2,2,2,3,0,0,1,3,0,3,2,0,3,2,2,3,3,3,3,3,1,0,2,2,2,0,2,2,1,2,
0,2,3,0,0,0,0,1,0,1,0,0,1,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
3,0,2,3,1,3,3,2,3,3,0,3,3,0,3,2,2,3,2,3,3,3,0,0,2,2,3,0,1,1,1,3,
0,0,3,0,0,0,2,2,0,1,3,0,1,2,2,2,3,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,
3,2,3,3,2,0,3,3,2,2,3,1,3,2,1,3,2,0,1,2,2,0,2,3,2,1,0,3,0,0,0,0,
3,0,0,2,3,1,3,0,0,3,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
3,1,3,2,2,2,1,2,0,1,3,1,1,3,1,3,0,0,2,1,1,1,1,2,1,1,1,0,2,1,0,1,
1,2,0,0,0,3,1,1,0,0,0,0,1,0,1,0,0,1,0,1,0,0,0,0,0,3,1,0,0,0,1,0,
3,3,3,3,2,2,2,2,2,1,3,1,1,1,2,0,1,1,2,1,2,1,3,2,0,0,3,1,1,1,1,1,
3,1,0,2,3,0,0,0,3,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,2,3,0,3,3,0,2,0,0,0,0,0,0,0,3,0,0,1,0,0,0,0,0,0,0,0,0,0,0,
0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,2,3,1,3,0,0,1,2,0,0,2,0,3,3,2,3,3,3,2,3,0,0,2,2,2,0,0,0,2,2,
0,0,1,0,0,0,0,3,0,0,0,0,2,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,
0,0,0,3,0,2,0,0,0,0,0,0,0,0,0,0,1,2,3,1,3,3,0,0,1,0,3,0,0,0,0,0,
0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
3,3,1,2,3,1,2,3,1,0,3,0,2,2,1,0,2,1,1,2,0,1,0,0,1,1,1,1,0,1,0,0,
1,0,0,0,0,1,1,0,3,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
3,3,3,3,2,1,0,1,1,1,3,1,2,2,2,2,2,2,1,1,1,1,0,3,1,0,1,3,1,1,1,1,
1,1,0,2,0,1,3,1,1,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,
3,0,2,2,1,3,3,2,3,3,0,1,1,0,2,2,1,2,1,3,3,1,0,0,3,2,0,0,0,0,2,1,
0,1,0,0,0,0,1,2,0,1,1,3,1,1,2,2,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,
0,0,3,0,0,1,0,0,0,3,0,0,3,0,3,1,0,1,1,1,3,2,0,0,0,3,0,0,0,0,2,0,
0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,2,0,0,0,0,0,0,0,0,0,
3,3,1,3,2,1,3,3,1,2,2,0,1,2,1,0,1,2,0,0,0,0,0,3,0,0,0,3,0,0,0,0,
3,0,0,1,1,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
3,0,1,2,0,3,3,3,2,2,0,1,1,0,1,3,0,0,0,2,2,0,0,0,0,3,1,0,1,0,0,0,
0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
3,0,2,3,1,2,0,0,2,1,0,3,1,0,1,2,0,1,1,1,1,3,0,0,3,1,1,0,2,2,1,1,
0,2,0,0,0,0,0,1,0,1,0,0,1,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
3,0,0,3,1,2,0,0,2,2,0,1,2,0,1,0,1,3,1,2,1,0,0,0,2,0,3,0,0,0,1,0,
0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
3,0,1,1,2,2,0,0,0,2,0,2,1,0,1,1,0,1,1,1,2,1,0,0,1,1,1,0,2,1,1,1,
0,1,1,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,1,
0,0,0,2,0,1,3,1,1,1,1,0,0,0,0,3,2,0,1,0,0,0,1,2,0,0,0,1,0,0,0,0,
0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,3,3,3,3,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
1,0,2,3,2,2,0,0,0,1,0,0,0,0,2,3,2,1,2,2,3,0,0,0,2,3,1,0,0,0,1,1,
0,0,1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,1,0,1,0,0,0,0,0,0,0,0,0,
3,3,2,2,0,1,0,0,0,0,2,0,2,0,1,0,0,0,1,1,0,0,0,2,1,0,1,0,1,1,0,0,
0,1,0,2,0,0,1,0,3,0,1,0,0,0,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
3,3,1,0,0,1,0,0,0,0,0,1,1,2,0,0,0,0,1,0,0,1,3,1,0,0,0,0,1,1,0,0,
0,1,0,0,0,0,3,0,0,0,0,0,0,3,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,
3,3,1,1,1,1,2,3,0,0,2,1,1,1,1,1,0,2,1,1,0,0,0,2,1,0,1,2,1,1,0,1,
2,1,0,3,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
1,3,1,0,0,0,0,0,0,0,3,0,0,0,3,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,
0,0,0,2,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
3,3,2,0,0,0,0,0,0,1,2,1,0,1,1,0,2,0,0,1,0,0,2,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,2,0,0,0,1,3,0,1,0,0,0,2,0,0,0,0,0,0,0,1,2,0,0,0,0,0,
3,3,0,0,1,1,2,0,0,1,2,1,0,1,1,1,0,1,1,0,0,2,1,1,0,1,0,0,1,1,1,0,
0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,
2,2,2,1,0,0,0,0,1,0,0,0,0,3,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,
2,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
2,3,0,0,1,1,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
1,1,0,1,2,0,1,2,0,0,1,1,0,2,0,1,0,0,1,0,0,0,0,1,0,0,0,2,0,0,0,0,
1,0,0,1,0,1,1,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,1,0,0,0,0,0,0,0,1,1,0,1,1,0,2,1,3,0,0,0,0,1,1,0,0,0,0,0,0,0,3,
1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
2,0,1,0,1,0,0,2,0,0,2,0,0,1,1,2,0,0,1,1,0,0,0,1,0,0,0,1,1,0,0,0,
1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,
1,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,1,1,0,0,0,
2,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
2,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,3,0,0,0,
2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,1,0,0,0,0,
1,0,0,0,0,0,0,0,0,1,0,0,0,0,2,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,1,1,0,0,2,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
];

jschardet.TIS620ThaiModel = {
    "charToOrderMap"        : jschardet.TIS620CharToOrderMap,
    "precedenceMatrix"      : jschardet.ThaiLangModel,
    "mTypicalPositiveRatio" : 0.926386,
    "keepEnglishLetter"     : false,
    "charsetName"           : "TIS-620"
};

/*
 * The Original Code is Mozilla Universal charset detector code.
 *
 * The Initial Developer of the Original Code is
 * Netscape Communications Corporation.
 * Portions created by the Initial Developer are Copyright (C) 2001
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   António Afonso (antonio.afonso gmail.com) - port to JavaScript
 *   Mark Pilgrim - port to Python
 *   Shy Shalom - original C code
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301  USA
 */

// 255: Control characters that usually does not exist in any text
// 254: Carriage/Return
// 253: symbol (punctuation) that does not belong to word
// 252: 0 - 9

// Character Mapping Table:
// this table is modified base on win1251BulgarianCharToOrderMap, so
// only number <64 is sure valid

jschardet.Latin5_BulgarianCharToOrderMap = [
255,255,255,255,255,255,255,255,255,255,254,255,255,254,255,255,  // 00
255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,  // 10
253,253,253,253,253,253,253,253,253,253,253,253,253,253,253,253,  // 20
252,252,252,252,252,252,252,252,252,252,253,253,253,253,253,253,  // 30
253, 77, 90, 99,100, 72,109,107,101, 79,185, 81,102, 76, 94, 82,  // 40
110,186,108, 91, 74,119, 84, 96,111,187,115,253,253,253,253,253,  // 50
253, 65, 69, 70, 66, 63, 68,112,103, 92,194,104, 95, 86, 87, 71,  // 60
116,195, 85, 93, 97,113,196,197,198,199,200,253,253,253,253,253,  // 70
194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,  // 80
210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,  // 90
 81,226,227,228,229,230,105,231,232,233,234,235,236, 45,237,238,  // a0
 31, 32, 35, 43, 37, 44, 55, 47, 40, 59, 33, 46, 38, 36, 41, 30,  // b0
 39, 28, 34, 51, 48, 49, 53, 50, 54, 57, 61,239, 67,240, 60, 56,  // c0
  1, 18,  9, 20, 11,  3, 23, 15,  2, 26, 12, 10, 14,  6,  4, 13,  // d0
  7,  8,  5, 19, 29, 25, 22, 21, 27, 24, 17, 75, 52,241, 42, 16,  // e0
 62,242,243,244, 58,245, 98,246,247,248,249,250,251, 91,252,253   // f0
];

jschardet.win1251BulgarianCharToOrderMap = [
255,255,255,255,255,255,255,255,255,255,254,255,255,254,255,255,  // 00
255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,  // 10
253,253,253,253,253,253,253,253,253,253,253,253,253,253,253,253,  // 20
252,252,252,252,252,252,252,252,252,252,253,253,253,253,253,253,  // 30
253, 77, 90, 99,100, 72,109,107,101, 79,185, 81,102, 76, 94, 82,  // 40
110,186,108, 91, 74,119, 84, 96,111,187,115,253,253,253,253,253,  // 50
253, 65, 69, 70, 66, 63, 68,112,103, 92,194,104, 95, 86, 87, 71,  // 60
116,195, 85, 93, 97,113,196,197,198,199,200,253,253,253,253,253,  // 70
206,207,208,209,210,211,212,213,120,214,215,216,217,218,219,220,  // 80
221, 78, 64, 83,121, 98,117,105,222,223,224,225,226,227,228,229,  // 90
 88,230,231,232,233,122, 89,106,234,235,236,237,238, 45,239,240,  // a0
 73, 80,118,114,241,242,243,244,245, 62, 58,246,247,248,249,250,  // b0
 31, 32, 35, 43, 37, 44, 55, 47, 40, 59, 33, 46, 38, 36, 41, 30,  // c0
 39, 28, 34, 51, 48, 49, 53, 50, 54, 57, 61,251, 67,252, 60, 56,  // d0
  1, 18,  9, 20, 11,  3, 23, 15,  2, 26, 12, 10, 14,  6,  4, 13,  // e0
  7,  8,  5, 19, 29, 25, 22, 21, 27, 24, 17, 75, 52,253, 42, 16   // f0
];

// Model Table:
// total sequences: 100%
// first 512 sequences: 96.9392%
// first 1024 sequences:3.0618%
// rest  sequences:     0.2992%
// negative sequences:  0.0020%
jschardet.BulgarianLangModel = [
0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,3,3,3,3,3,3,3,3,2,3,3,3,3,3,
3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,3,3,3,2,2,3,2,2,1,2,2,
3,1,3,3,2,3,3,3,3,3,3,3,3,3,3,3,3,0,3,3,3,3,3,3,3,3,3,3,0,3,0,1,
0,0,0,0,0,0,0,0,0,0,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,3,2,3,3,3,3,3,3,3,3,0,3,1,0,
0,1,0,0,0,0,0,0,0,0,1,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
3,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,1,3,2,3,3,3,3,3,3,3,3,0,3,0,0,
0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
3,2,3,3,2,3,3,3,3,3,3,3,3,3,3,3,3,1,3,2,3,3,3,3,3,3,3,3,0,3,0,0,
0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
3,3,3,3,3,3,3,3,3,3,3,2,3,2,2,1,3,3,3,3,2,2,2,1,1,2,0,1,0,1,0,0,
0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,1,
3,3,3,3,3,3,3,2,3,2,2,3,3,1,1,2,3,3,2,3,3,3,3,2,1,2,0,2,0,3,0,0,
0,0,0,0,0,0,0,1,0,0,2,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,1,
3,3,3,3,3,3,3,1,3,3,3,3,3,2,3,2,3,3,3,3,3,2,3,3,1,3,0,3,0,2,0,0,
0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,
3,3,3,3,3,3,3,3,1,3,3,2,3,3,3,1,3,3,2,3,2,2,2,0,0,2,0,2,0,2,0,0,
0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,1,
3,3,3,3,3,3,3,3,3,0,3,3,3,2,2,3,3,3,1,2,2,3,2,1,1,2,0,2,0,0,0,0,
1,0,0,0,0,0,0,0,0,0,2,0,0,1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,
3,3,3,3,3,3,3,2,3,3,1,2,3,2,2,2,3,3,3,3,3,2,2,3,1,2,0,2,1,2,0,0,
0,0,0,0,0,0,0,0,0,0,3,0,0,1,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,1,
3,3,3,3,3,1,3,3,3,3,3,2,3,3,3,2,3,3,2,3,2,2,2,3,1,2,0,1,0,1,0,0,
0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,
3,3,3,3,3,3,3,3,3,3,3,1,1,1,2,2,1,3,1,3,2,2,3,0,0,1,0,1,0,1,0,0,
0,0,0,1,0,0,0,0,1,0,2,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,
3,3,3,3,3,2,2,3,2,2,3,1,2,1,1,1,2,3,1,3,1,2,2,0,1,1,1,1,0,1,0,0,
0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,
3,3,3,3,3,1,3,2,2,3,3,1,2,3,1,1,3,3,3,3,1,2,2,1,1,1,0,2,0,2,0,1,
0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,
3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1,2,2,3,3,3,2,2,1,1,2,0,2,0,1,0,0,
0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,
3,0,1,2,1,3,3,2,3,3,3,3,3,2,3,2,1,0,3,1,2,1,2,1,2,3,2,1,0,1,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
1,1,1,2,3,3,3,3,3,3,3,3,3,3,3,3,0,0,3,1,3,3,2,3,3,2,2,2,0,1,0,0,
0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
2,3,3,3,3,0,3,3,3,3,3,2,1,1,2,1,3,3,0,3,1,1,1,1,3,2,0,1,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,
3,3,2,2,2,3,3,3,3,3,3,3,3,3,3,3,1,1,3,1,3,3,2,3,2,2,2,3,0,2,0,0,
0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
3,3,3,3,3,2,3,3,2,2,3,2,1,1,1,1,1,3,1,3,1,1,0,0,0,1,0,0,0,1,0,0,
0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,
3,3,3,3,3,2,3,2,0,3,2,0,3,0,2,0,0,2,1,3,1,0,0,1,0,0,0,1,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
3,3,3,3,2,1,1,1,1,2,1,1,2,1,1,1,2,2,1,2,1,1,1,0,1,1,0,1,0,1,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,
3,3,3,3,2,1,3,1,1,2,1,3,2,1,1,0,1,2,3,2,1,1,1,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
2,3,3,3,3,2,2,1,0,1,0,0,1,0,0,0,2,1,0,3,0,0,1,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
3,3,3,2,3,2,3,3,1,3,2,1,1,1,2,1,1,2,1,3,0,1,0,0,0,1,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
3,1,1,2,2,3,3,2,3,2,2,2,3,1,2,2,1,1,2,1,1,2,2,0,1,1,0,1,0,2,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
3,3,3,3,2,1,3,1,0,2,2,1,3,2,1,0,0,2,0,2,0,1,0,0,0,0,0,0,0,1,0,0,
0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,
3,3,3,3,3,3,1,2,0,2,3,1,2,3,2,0,1,3,1,2,1,1,1,0,0,1,0,0,2,2,2,3,
2,2,2,2,1,2,1,1,2,2,1,1,2,0,1,1,1,0,0,1,1,0,0,1,1,0,0,0,1,1,0,1,
3,3,3,3,3,2,1,2,2,1,2,0,2,0,1,0,1,2,1,2,1,1,0,0,0,1,0,1,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,1,
3,3,2,3,3,1,1,3,1,0,3,2,1,0,0,0,1,2,0,2,0,1,0,0,0,1,0,1,2,1,2,2,
1,1,1,1,1,1,1,2,2,2,1,1,1,1,1,1,1,0,1,2,1,1,1,0,0,0,0,0,1,1,0,0,
3,1,0,1,0,2,3,2,2,2,3,2,2,2,2,2,1,0,2,1,2,1,1,1,0,1,2,1,2,2,2,1,
1,1,2,2,2,2,1,2,1,1,0,1,2,1,2,2,2,1,1,1,0,1,1,1,1,2,0,1,0,0,0,0,
2,3,2,3,3,0,0,2,1,0,2,1,0,0,0,0,2,3,0,2,0,0,0,0,0,1,0,0,2,0,1,2,
2,1,2,1,2,2,1,1,1,2,1,1,1,0,1,2,2,1,1,1,1,1,0,1,1,1,0,0,1,2,0,0,
3,3,2,2,3,0,2,3,1,1,2,0,0,0,1,0,0,2,0,2,0,0,0,1,0,1,0,1,2,0,2,2,
1,1,1,1,2,1,0,1,2,2,2,1,1,1,1,1,1,1,0,1,1,1,0,0,0,0,0,0,1,1,0,0,
2,3,2,3,3,0,0,3,0,1,1,0,1,0,0,0,2,2,1,2,0,0,0,0,0,0,0,0,2,0,1,2,
2,2,1,1,1,1,1,2,2,2,1,0,2,0,1,0,1,0,0,1,0,1,0,0,1,0,0,0,0,1,0,0,
3,3,3,3,2,2,2,2,2,0,2,1,1,1,1,2,1,2,1,1,0,2,0,1,0,1,0,0,2,0,1,2,
1,1,1,1,1,1,1,2,2,1,1,0,2,0,1,0,2,0,0,1,1,1,0,0,2,0,0,0,1,1,0,0,
2,3,3,3,3,1,0,0,0,0,0,0,0,0,0,0,2,0,0,1,1,0,0,0,0,0,0,1,2,0,1,2,
2,2,2,1,1,2,1,1,2,2,2,1,2,0,1,1,1,1,1,1,0,1,1,1,1,0,0,1,1,1,0,0,
2,3,3,3,3,0,2,2,0,2,1,0,0,0,1,1,1,2,0,2,0,0,0,3,0,0,0,0,2,0,2,2,
1,1,1,2,1,2,1,1,2,2,2,1,2,0,1,1,1,0,1,1,1,1,0,2,1,0,0,0,1,1,0,0,
2,3,3,3,3,0,2,1,0,0,2,0,0,0,0,0,1,2,0,2,0,0,0,0,0,0,0,0,2,0,1,2,
1,1,1,2,1,1,1,1,2,2,2,0,1,0,1,1,1,0,0,1,1,1,0,0,1,0,0,0,0,1,0,0,
3,3,2,2,3,0,1,0,1,0,0,0,0,0,0,0,1,1,0,3,0,0,0,0,0,0,0,0,1,0,2,2,
1,1,1,1,1,2,1,1,2,2,1,2,2,1,0,1,1,1,1,1,0,1,0,0,1,0,0,0,1,1,0,0,
3,1,0,1,0,2,2,2,2,3,2,1,1,1,2,3,0,0,1,0,2,1,1,0,1,1,1,1,2,1,1,1,
1,2,2,1,2,1,2,2,1,1,0,1,2,1,2,2,1,1,1,0,0,1,1,1,2,1,0,1,0,0,0,0,
2,1,0,1,0,3,1,2,2,2,2,1,2,2,1,1,1,0,2,1,2,2,1,1,2,1,1,0,2,1,1,1,
1,2,2,2,2,2,2,2,1,2,0,1,1,0,2,1,1,1,1,1,0,0,1,1,1,1,0,1,0,0,0,0,
2,1,1,1,1,2,2,2,2,1,2,2,2,1,2,2,1,1,2,1,2,3,2,2,1,1,1,1,0,1,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
2,2,2,3,2,0,1,2,0,1,2,1,1,0,1,0,1,2,1,2,0,0,0,1,1,0,0,0,1,0,0,2,
1,1,0,0,1,1,0,1,1,1,1,0,2,0,1,1,1,0,0,1,1,0,0,0,0,1,0,0,0,1,0,0,
2,0,0,0,0,1,2,2,2,2,2,2,2,1,2,1,1,1,1,1,1,1,0,1,1,1,1,1,2,1,1,1,
1,2,2,2,2,1,1,2,1,2,1,1,1,0,2,1,2,1,1,1,0,2,1,1,1,1,0,1,0,0,0,0,
3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,
1,1,0,1,0,1,1,1,1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
2,2,2,3,2,0,0,0,0,1,0,0,0,0,0,0,1,1,0,2,0,0,0,0,0,0,0,0,1,0,1,2,
1,1,1,1,1,1,0,0,2,2,2,2,2,0,1,1,0,1,1,1,1,1,0,0,1,0,0,0,1,1,0,1,
2,3,1,2,1,0,1,1,0,2,2,2,0,0,1,0,0,1,1,1,1,0,0,0,0,0,0,0,1,0,1,2,
1,1,1,1,2,1,1,1,1,1,1,1,1,0,1,1,0,1,0,1,0,1,0,0,1,0,0,0,0,1,0,0,
2,2,2,2,2,0,0,2,0,0,2,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,2,0,2,2,
1,1,1,1,1,0,0,1,2,1,1,0,1,0,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,
1,2,2,2,2,0,0,2,0,1,1,0,0,0,1,0,0,2,0,2,0,0,0,0,0,0,0,0,0,0,1,1,
0,0,0,1,1,1,1,1,1,1,1,1,1,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,
1,2,2,3,2,0,0,1,0,0,1,0,0,0,0,0,0,1,0,2,0,0,0,1,0,0,0,0,0,0,0,2,
1,1,0,0,1,0,0,0,1,1,0,0,1,0,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,
2,1,2,2,2,1,2,1,2,2,1,1,2,1,1,1,0,1,1,1,1,2,0,1,0,1,1,1,1,0,1,1,
1,1,2,1,1,1,1,1,1,0,0,1,2,1,1,1,1,1,1,0,0,1,1,1,0,0,0,0,0,0,0,0,
1,0,0,1,3,1,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
2,2,2,2,1,0,0,1,0,2,0,0,0,0,0,1,1,1,0,1,0,0,0,0,0,0,0,0,2,0,0,1,
0,2,0,1,0,0,1,1,2,0,1,0,1,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,
1,2,2,2,2,0,1,1,0,2,1,0,1,1,1,0,0,1,0,2,0,1,0,0,0,0,0,0,0,0,0,1,
0,1,0,0,1,0,0,0,1,1,0,0,1,0,0,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,
2,2,2,2,2,0,0,1,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,1,
0,1,0,1,1,1,0,0,1,1,1,0,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,
2,0,1,0,0,1,2,1,1,1,1,1,1,2,2,1,0,0,1,0,1,0,0,0,0,1,1,1,1,0,0,0,
1,1,2,1,1,1,1,0,0,0,1,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
2,2,1,2,1,0,0,1,0,0,0,0,0,0,0,0,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,1,
0,0,0,0,0,0,0,0,1,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
1,0,0,1,2,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,
0,1,1,0,1,1,1,0,0,1,0,0,1,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,
1,0,1,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,1,0,2,0,0,2,0,1,0,0,1,0,0,1,
1,1,0,0,1,1,0,1,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,1,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,
1,1,1,1,1,1,1,2,0,0,0,0,0,0,2,1,0,1,1,0,0,1,1,1,0,1,0,0,0,0,0,0,
2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,1,0,1,1,1,1,1,0,1,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1
];

jschardet.Latin5BulgarianModel = {
    "charToOrderMap"        : jschardet.Latin5_BulgarianCharToOrderMap,
    "precedenceMatrix"      : jschardet.BulgarianLangModel,
    "mTypicalPositiveRatio" : 0.969392,
    "keepEnglishLetter"     : false,
    "charsetName"           : "ISO-8859-5"
};

jschardet.Win1251BulgarianModel = {
    "charToOrderMap"        : jschardet.win1251BulgarianCharToOrderMap,
    "precedenceMatrix"      : jschardet.BulgarianLangModel,
    "mTypicalPositiveRatio" : 0.969392,
    "keepEnglishLetter"     : false,
    "charsetName"           : "windows-1251"
};

/*
 * The Original Code is Mozilla Universal charset detector code.
 *
 * The Initial Developer of the Original Code is
 * Netscape Communications Corporation.
 * Portions created by the Initial Developer are Copyright (C) 2001
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   António Afonso (antonio.afonso gmail.com) - port to JavaScript
 *   Mark Pilgrim - port to Python
 *   Shy Shalom - original C code
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301  USA
 */

// KOI8-R language model
// Character Mapping Table:
jschardet.KOI8R_CharToOrderMap = [
255,255,255,255,255,255,255,255,255,255,254,255,255,254,255,255,  // 00
255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,  // 10
253,253,253,253,253,253,253,253,253,253,253,253,253,253,253,253,  // 20
252,252,252,252,252,252,252,252,252,252,253,253,253,253,253,253,  // 30
253,142,143,144,145,146,147,148,149,150,151,152, 74,153, 75,154,  // 40
155,156,157,158,159,160,161,162,163,164,165,253,253,253,253,253,  // 50
253, 71,172, 66,173, 65,174, 76,175, 64,176,177, 77, 72,178, 69,  // 60
 67,179, 78, 73,180,181, 79,182,183,184,185,253,253,253,253,253,  // 70
191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,  // 80
207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,  // 90
223,224,225, 68,226,227,228,229,230,231,232,233,234,235,236,237,  // a0
238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,  // b0
 27,  3, 21, 28, 13,  2, 39, 19, 26,  4, 23, 11,  8, 12,  5,  1,  // c0
 15, 16,  9,  7,  6, 14, 24, 10, 17, 18, 20, 25, 30, 29, 22, 54,  // d0
 59, 37, 44, 58, 41, 48, 53, 46, 55, 42, 60, 36, 49, 38, 31, 34,  // e0
 35, 43, 45, 32, 40, 52, 56, 33, 61, 62, 51, 57, 47, 63, 50, 70   // f0
];

jschardet.win1251_CharToOrderMap = [
255,255,255,255,255,255,255,255,255,255,254,255,255,254,255,255,  // 00
255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,  // 10
253,253,253,253,253,253,253,253,253,253,253,253,253,253,253,253,  // 20
252,252,252,252,252,252,252,252,252,252,253,253,253,253,253,253,  // 30
253,142,143,144,145,146,147,148,149,150,151,152, 74,153, 75,154,  // 40
155,156,157,158,159,160,161,162,163,164,165,253,253,253,253,253,  // 50
253, 71,172, 66,173, 65,174, 76,175, 64,176,177, 77, 72,178, 69,  // 60
 67,179, 78, 73,180,181, 79,182,183,184,185,253,253,253,253,253,  // 70
191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,
207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,
223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,
239,240,241,242,243,244,245,246, 68,247,248,249,250,251,252,253,
 37, 44, 33, 46, 41, 48, 56, 51, 42, 60, 36, 49, 38, 31, 34, 35,
 45, 32, 40, 52, 53, 55, 58, 50, 57, 63, 70, 62, 61, 47, 59, 43,
  3, 21, 10, 19, 13,  2, 24, 20,  4, 23, 11,  8, 12,  5,  1, 15,
  9,  7,  6, 14, 39, 26, 28, 22, 25, 29, 54, 18, 17, 30, 27, 16
];

jschardet.latin5_CharToOrderMap = [
255,255,255,255,255,255,255,255,255,255,254,255,255,254,255,255,  // 00
255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,  // 10
253,253,253,253,253,253,253,253,253,253,253,253,253,253,253,253,  // 20
252,252,252,252,252,252,252,252,252,252,253,253,253,253,253,253,  // 30
253,142,143,144,145,146,147,148,149,150,151,152, 74,153, 75,154,  // 40
155,156,157,158,159,160,161,162,163,164,165,253,253,253,253,253,  // 50
253, 71,172, 66,173, 65,174, 76,175, 64,176,177, 77, 72,178, 69,  // 60
 67,179, 78, 73,180,181, 79,182,183,184,185,253,253,253,253,253,  // 70
191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,
207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,
223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,
 37, 44, 33, 46, 41, 48, 56, 51, 42, 60, 36, 49, 38, 31, 34, 35,
 45, 32, 40, 52, 53, 55, 58, 50, 57, 63, 70, 62, 61, 47, 59, 43,
  3, 21, 10, 19, 13,  2, 24, 20,  4, 23, 11,  8, 12,  5,  1, 15,
  9,  7,  6, 14, 39, 26, 28, 22, 25, 29, 54, 18, 17, 30, 27, 16,
239, 68,240,241,242,243,244,245,246,247,248,249,250,251,252,255
];

jschardet.macCyrillic_CharToOrderMap = [
255,255,255,255,255,255,255,255,255,255,254,255,255,254,255,255,  // 00
255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,  // 10
253,253,253,253,253,253,253,253,253,253,253,253,253,253,253,253,  // 20
252,252,252,252,252,252,252,252,252,252,253,253,253,253,253,253,  // 30
253,142,143,144,145,146,147,148,149,150,151,152, 74,153, 75,154,  // 40
155,156,157,158,159,160,161,162,163,164,165,253,253,253,253,253,  // 50
253, 71,172, 66,173, 65,174, 76,175, 64,176,177, 77, 72,178, 69,  // 60
 67,179, 78, 73,180,181, 79,182,183,184,185,253,253,253,253,253,  // 70
 37, 44, 33, 46, 41, 48, 56, 51, 42, 60, 36, 49, 38, 31, 34, 35,
 45, 32, 40, 52, 53, 55, 58, 50, 57, 63, 70, 62, 61, 47, 59, 43,
191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,
207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,
223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,
239,240,241,242,243,244,245,246,247,248,249,250,251,252, 68, 16,
  3, 21, 10, 19, 13,  2, 24, 20,  4, 23, 11,  8, 12,  5,  1, 15,
  9,  7,  6, 14, 39, 26, 28, 22, 25, 29, 54, 18, 17, 30, 27,255
];

jschardet.IBM855_CharToOrderMap = [
255,255,255,255,255,255,255,255,255,255,254,255,255,254,255,255,  // 00
255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,  // 10
253,253,253,253,253,253,253,253,253,253,253,253,253,253,253,253,  // 20
252,252,252,252,252,252,252,252,252,252,253,253,253,253,253,253,  // 30
253,142,143,144,145,146,147,148,149,150,151,152, 74,153, 75,154,  // 40
155,156,157,158,159,160,161,162,163,164,165,253,253,253,253,253,  // 50
253, 71,172, 66,173, 65,174, 76,175, 64,176,177, 77, 72,178, 69,  // 60
 67,179, 78, 73,180,181, 79,182,183,184,185,253,253,253,253,253,  // 70
191,192,193,194, 68,195,196,197,198,199,200,201,202,203,204,205,
206,207,208,209,210,211,212,213,214,215,216,217, 27, 59, 54, 70,
  3, 37, 21, 44, 28, 58, 13, 41,  2, 48, 39, 53, 19, 46,218,219,
220,221,222,223,224, 26, 55,  4, 42,225,226,227,228, 23, 60,229,
230,231,232,233,234,235, 11, 36,236,237,238,239,240,241,242,243,
  8, 49, 12, 38,  5, 31,  1, 34, 15,244,245,246,247, 35, 16,248,
 43,  9, 45,  7, 32,  6, 40, 14, 52, 24, 56, 10, 33, 17, 61,249,
250, 18, 62, 20, 51, 25, 57, 30, 47, 29, 63, 22, 50,251,252,255
];

jschardet.IBM866_CharToOrderMap = [
255,255,255,255,255,255,255,255,255,255,254,255,255,254,255,255,  // 00
255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,  // 10
253,253,253,253,253,253,253,253,253,253,253,253,253,253,253,253,  // 20
252,252,252,252,252,252,252,252,252,252,253,253,253,253,253,253,  // 30
253,142,143,144,145,146,147,148,149,150,151,152, 74,153, 75,154,  // 40
155,156,157,158,159,160,161,162,163,164,165,253,253,253,253,253,  // 50
253, 71,172, 66,173, 65,174, 76,175, 64,176,177, 77, 72,178, 69,  // 60
 67,179, 78, 73,180,181, 79,182,183,184,185,253,253,253,253,253,  // 70
 37, 44, 33, 46, 41, 48, 56, 51, 42, 60, 36, 49, 38, 31, 34, 35,
 45, 32, 40, 52, 53, 55, 58, 50, 57, 63, 70, 62, 61, 47, 59, 43,
  3, 21, 10, 19, 13,  2, 24, 20,  4, 23, 11,  8, 12,  5,  1, 15,
191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,
207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,
223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,
  9,  7,  6, 14, 39, 26, 28, 22, 25, 29, 54, 18, 17, 30, 27, 16,
239, 68,240,241,242,243,244,245,246,247,248,249,250,251,252,255
];

// Model Table:
// total sequences: 100%
// first 512 sequences: 97.6601%
// first 1024 sequences: 2.3389%
// rest  sequences:      0.1237%
// negative sequences:   0.0009%
jschardet.RussianLangModel = [
0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1,1,3,3,3,3,1,3,3,3,2,3,2,3,3,
3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,3,2,2,2,2,2,0,0,2,
3,3,3,2,3,3,3,3,3,3,3,3,3,3,2,3,3,0,0,3,3,3,3,3,3,3,3,3,2,3,2,0,
0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
3,3,3,2,2,3,3,3,3,3,3,3,3,3,2,3,3,0,0,3,3,3,3,3,3,3,3,2,3,3,1,0,
0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
3,2,3,2,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0,3,3,3,3,3,3,3,3,3,3,3,2,1,
0,0,0,0,0,0,0,2,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,3,3,0,0,3,3,3,3,3,3,3,3,3,3,3,2,1,
0,0,0,0,0,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
3,3,3,3,3,3,3,3,2,2,2,3,1,3,3,1,3,3,3,3,2,2,3,0,2,2,2,3,3,2,1,0,
0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,
3,3,3,3,3,3,2,3,3,3,3,3,2,2,3,2,3,3,3,2,1,2,2,0,1,2,2,2,2,2,2,0,
0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,
3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,2,3,0,2,2,3,3,2,1,2,0,
0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,1,0,0,2,0,0,0,0,0,0,0,0,0,
3,3,3,3,3,3,2,3,3,1,2,3,2,2,3,2,3,3,3,3,2,2,3,0,3,2,2,3,1,1,1,0,
0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
3,3,3,3,3,3,3,3,2,2,3,3,3,3,3,2,3,3,3,3,2,2,2,0,3,3,3,2,2,2,2,0,
0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
3,3,3,3,3,3,3,3,3,3,2,3,2,3,3,3,3,3,3,2,3,2,2,0,1,3,2,1,2,2,1,0,
0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,
3,3,3,3,3,3,3,3,3,3,3,2,1,1,3,0,1,1,1,1,2,1,1,0,2,2,2,1,2,0,1,0,
0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
3,3,3,3,3,3,2,3,3,2,2,2,2,1,3,2,3,2,3,2,1,2,2,0,1,1,2,1,2,1,2,0,
0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
3,3,3,3,3,3,3,3,3,3,3,3,2,2,3,2,3,3,3,2,2,2,2,0,2,2,2,2,3,1,1,0,
0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,
3,2,3,2,2,3,3,3,3,3,3,3,3,3,1,3,2,0,0,3,3,3,3,2,3,3,3,3,2,3,2,0,
0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
2,3,3,3,3,3,2,2,3,3,0,2,1,0,3,2,3,2,3,0,0,1,2,0,0,1,0,1,2,1,1,0,
0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
3,0,3,0,2,3,3,3,3,2,3,3,3,3,1,2,2,0,0,2,3,2,2,2,3,2,3,2,2,3,0,0,
0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
3,2,3,0,2,3,2,3,0,1,2,3,3,2,0,2,3,0,0,2,3,2,2,0,1,3,1,3,2,2,1,0,
0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
3,1,3,0,2,3,3,3,3,3,3,3,3,2,1,3,2,0,0,2,2,3,3,3,2,3,3,0,2,2,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
3,3,3,3,3,3,2,2,3,3,2,2,2,3,3,0,0,1,1,1,1,1,2,0,0,1,1,1,1,0,1,0,
0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
3,3,3,3,3,3,2,2,3,3,3,3,3,3,3,0,3,2,3,3,2,3,2,0,2,1,0,1,1,0,1,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,
3,3,3,3,3,3,2,3,3,3,2,2,2,2,3,1,3,2,3,1,1,2,1,0,2,2,2,2,1,3,1,0,
0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,
2,2,3,3,3,3,3,1,2,2,1,3,1,0,3,0,0,3,0,0,0,1,1,0,1,2,1,0,0,0,0,0,
0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
3,2,2,1,1,3,3,3,2,2,1,2,2,3,1,1,2,0,0,2,2,1,3,0,0,2,1,1,2,1,1,0,
0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
3,2,3,3,3,3,1,2,2,2,1,2,1,3,3,1,1,2,1,2,1,2,2,0,2,0,0,1,1,0,1,0,
0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
2,3,3,3,3,3,2,1,3,2,2,3,2,0,3,2,0,3,0,1,0,1,1,0,0,1,1,1,1,0,1,0,
0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
3,3,2,3,3,3,2,2,2,3,3,1,2,1,2,1,0,1,0,1,1,0,1,0,0,2,1,1,1,0,1,0,
0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,
3,1,1,2,1,2,3,3,2,2,1,2,2,3,0,2,1,0,0,2,2,3,2,1,2,2,2,2,2,3,1,0,
0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
3,3,3,3,3,1,1,0,1,1,2,2,1,1,3,0,0,1,3,1,1,1,0,0,0,1,0,1,1,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
2,1,3,3,3,2,0,0,0,2,1,0,1,0,2,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
2,0,1,0,0,2,3,2,2,2,1,2,2,2,1,2,1,0,0,1,1,1,0,2,0,1,1,1,0,0,1,1,
1,0,0,0,0,0,1,2,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,
2,3,3,3,3,0,0,0,0,1,0,0,0,0,3,0,1,2,1,0,0,0,0,0,0,0,1,1,0,0,1,1,
1,0,1,0,1,2,0,0,1,1,2,1,0,1,1,1,1,0,1,1,1,1,0,1,0,0,1,0,0,1,1,0,
2,2,3,2,2,2,3,1,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,0,1,0,1,1,1,0,2,1,
1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,0,1,0,1,1,0,1,1,1,0,1,1,0,
3,3,3,2,2,2,2,3,2,2,1,1,2,2,2,2,1,1,3,1,2,1,2,0,0,1,1,0,1,0,2,1,
1,1,1,1,1,2,1,0,1,1,1,1,0,1,0,0,1,1,0,0,1,0,1,0,0,1,0,0,0,1,1,0,
2,0,0,1,0,3,2,2,2,2,1,2,1,2,1,2,0,0,0,2,1,2,2,1,1,2,2,0,1,1,0,2,
1,1,1,1,1,0,1,1,1,2,1,1,1,2,1,0,1,2,1,1,1,1,0,1,1,1,0,0,1,0,0,1,
1,3,2,2,2,1,1,1,2,3,0,0,0,0,2,0,2,2,1,0,0,0,0,0,0,1,0,0,0,0,1,1,
1,0,1,1,0,1,0,1,1,0,1,1,0,2,0,0,1,1,0,0,1,0,0,0,0,0,0,0,0,1,1,0,
2,3,2,3,2,1,2,2,2,2,1,0,0,0,2,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,2,1,
1,1,2,1,0,2,0,0,1,0,1,0,0,1,0,0,1,1,0,1,1,0,0,0,0,0,1,0,0,0,0,0,
3,0,0,1,0,2,2,2,3,2,2,2,2,2,2,2,0,0,0,2,1,2,1,1,1,2,2,0,0,0,1,2,
1,1,1,1,1,0,1,2,1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,0,1,
2,3,2,3,3,2,0,1,1,1,0,0,1,0,2,0,1,1,3,1,0,0,0,0,0,0,0,1,0,0,2,1,
1,1,1,1,1,1,1,0,1,0,1,1,1,1,0,1,1,1,0,0,1,1,0,1,0,0,0,0,0,0,1,0,
2,3,3,3,3,1,2,2,2,2,0,1,1,0,2,1,1,1,2,1,0,1,1,0,0,1,0,1,0,0,2,0,
0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
2,3,3,3,2,0,0,1,1,2,2,1,0,0,2,0,1,1,3,0,0,1,0,0,0,0,0,1,0,1,2,1,
1,1,2,0,1,1,1,0,1,0,1,1,0,1,0,1,1,1,1,0,1,0,0,0,0,0,0,1,0,1,1,0,
1,3,2,3,2,1,0,0,2,2,2,0,1,0,2,0,1,1,1,0,1,0,0,0,3,0,1,1,0,0,2,1,
1,1,1,0,1,1,0,0,0,0,1,1,0,1,0,0,2,1,1,0,1,0,0,0,1,0,1,0,0,1,1,0,
3,1,2,1,1,2,2,2,2,2,2,1,2,2,1,1,0,0,0,2,2,2,0,0,0,1,2,1,0,1,0,1,
2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,2,1,1,1,0,1,0,1,1,0,1,1,1,0,0,1,
3,0,0,0,0,2,0,1,1,1,1,1,1,1,0,1,0,0,0,1,1,1,0,1,0,1,1,0,0,1,0,1,
1,1,0,0,1,0,0,0,1,0,1,1,0,0,1,0,1,0,1,0,0,0,0,1,0,0,0,1,0,0,0,1,
1,3,3,2,2,0,0,0,2,2,0,0,0,1,2,0,1,1,2,0,0,0,0,0,0,0,0,1,0,0,2,1,
0,1,1,0,0,1,1,0,0,0,1,1,0,1,1,0,1,1,0,0,1,0,0,0,0,0,0,0,0,0,1,0,
2,3,2,3,2,0,0,0,0,1,1,0,0,0,2,0,2,0,2,0,0,0,0,0,1,0,0,1,0,0,1,1,
1,1,2,0,1,2,1,0,1,1,2,1,1,1,1,1,2,1,1,0,1,0,0,1,1,1,1,1,0,1,1,0,
1,3,2,2,2,1,0,0,2,2,1,0,1,2,2,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,1,1,
0,0,1,1,0,1,1,0,0,1,1,0,1,1,0,0,1,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,
1,0,0,1,0,2,3,1,2,2,2,2,2,2,1,1,0,0,0,1,0,1,0,2,1,1,1,0,0,0,0,1,
1,1,0,1,1,0,1,1,1,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,
2,0,2,0,0,1,0,3,2,1,2,1,2,2,0,1,0,0,0,2,1,0,0,2,1,1,1,1,0,2,0,2,
2,1,1,1,1,1,1,1,1,1,1,1,1,2,1,0,1,1,1,1,0,0,0,1,1,1,1,0,1,0,0,1,
1,2,2,2,2,1,0,0,1,0,0,0,0,0,2,0,1,1,1,1,0,0,0,0,1,0,1,2,0,0,2,0,
1,0,1,1,1,2,1,0,1,0,1,1,0,0,1,0,1,1,1,0,1,0,0,0,1,0,0,1,0,1,1,0,
2,1,2,2,2,0,3,0,1,1,0,0,0,0,2,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
0,0,0,1,1,1,0,0,1,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,
1,2,2,3,2,2,0,0,1,1,2,0,1,2,1,0,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0,1,
0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,1,1,0,0,1,0,0,0,0,0,0,0,0,1,1,0,
2,2,1,1,2,1,2,2,2,2,2,1,2,2,0,1,0,0,0,1,2,2,2,1,2,1,1,1,1,1,2,1,
1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,0,1,1,1,0,0,0,0,1,1,1,0,1,1,0,0,1,
1,2,2,2,2,0,1,0,2,2,0,0,0,0,2,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,2,0,
0,0,1,0,0,1,0,0,0,0,1,0,1,1,0,0,1,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,
0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
1,2,2,2,2,0,0,0,2,2,2,0,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,
0,1,1,0,0,1,1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
1,2,2,2,2,0,0,0,0,1,0,0,1,1,2,0,0,0,0,1,0,1,0,0,1,0,0,2,0,0,0,1,
0,0,1,0,0,1,0,0,0,1,1,0,0,0,0,0,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,
1,2,2,2,1,1,2,0,2,1,1,1,1,0,2,2,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1,1,
0,0,1,0,1,1,0,0,0,0,1,0,0,0,0,0,1,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,
1,0,2,1,2,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,
0,0,1,0,1,1,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,
1,0,0,0,0,2,0,1,2,1,0,1,1,1,0,1,0,0,0,1,0,1,0,0,1,0,1,0,0,0,0,1,
0,0,0,0,0,1,0,0,1,1,0,0,1,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,
2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
1,0,0,0,1,0,0,0,1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,
2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
1,1,1,0,1,0,1,0,0,1,1,1,1,0,0,0,1,0,0,0,0,1,0,0,0,1,0,1,0,0,0,0,
1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
1,1,0,1,1,0,1,0,1,0,0,0,0,1,1,0,1,1,0,0,0,0,0,1,0,1,1,0,1,0,0,0,
0,1,1,1,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0
];

jschardet.Koi8rModel = {
    "charToOrderMap"          : jschardet.KOI8R_CharToOrderMap,
    "precedenceMatrix"        : jschardet.RussianLangModel,
    "mTypicalPositiveRatio"   : 0.976601,
    "keepEnglishLetter"       : false,
    "charsetName"             : "KOI8-R"
};

jschardet.Win1251CyrillicModel = {
    "charToOrderMap"          : jschardet.win1251_CharToOrderMap,
    "precedenceMatrix"        : jschardet.RussianLangModel,
    "mTypicalPositiveRatio"   : 0.976601,
    "keepEnglishLetter"       : false,
    "charsetName"             : "windows-1251"
};

jschardet.Latin5CyrillicModel = {
    "charToOrderMap"          : jschardet.latin5_CharToOrderMap,
    "precedenceMatrix"        : jschardet.RussianLangModel,
    "mTypicalPositiveRatio"   : 0.976601,
    "keepEnglishLetter"       : false,
    "charsetName"             : "ISO-8859-5"
};

jschardet.MacCyrillicModel = {
    "charToOrderMap"          : jschardet.macCyrillic_CharToOrderMap,
    "precedenceMatrix"        : jschardet.RussianLangModel,
    "mTypicalPositiveRatio"   : 0.976601,
    "keepEnglishLetter"       : false,
    "charsetName"             : "MacCyrillic"
};

jschardet.Ibm866Model = {
    "charToOrderMap"          : jschardet.IBM866_CharToOrderMap,
    "precedenceMatrix"        : jschardet.RussianLangModel,
    "mTypicalPositiveRatio"   : 0.976601,
    "keepEnglishLetter"       : false,
    "charsetName"             : "IBM866"
};

jschardet.Ibm855Model = {
    "charToOrderMap"          : jschardet.IBM855_CharToOrderMap,
    "precedenceMatrix"        : jschardet.RussianLangModel,
    "mTypicalPositiveRatio"   : 0.976601,
    "keepEnglishLetter"       : false,
    "charsetName"             : "IBM855"
};

/*
 * The Original Code is Mozilla Universal charset detector code.
 *
 * The Initial Developer of the Original Code is
 * Netscape Communications Corporation.
 * Portions created by the Initial Developer are Copyright (C) 2001
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   António Afonso (antonio.afonso gmail.com) - port to JavaScript
 *   Mark Pilgrim - port to Python
 *   Shy Shalom - original C code
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301  USA
 */

// This prober doesn't actually recognize a language or a charset.
// It is a helper prober for the use of the Hebrew model probers

////// General ideas of the Hebrew charset recognition //////
//
// Four main charsets exist in Hebrew:
// "ISO-8859-8" - Visual Hebrew
// "windows-1255" - Logical Hebrew
// "ISO-8859-8-I" - Logical Hebrew
// "x-mac-hebrew" - ?? Logical Hebrew ??
//
// Both "ISO" charsets use a completely identical set of code points, whereas
// "windows-1255" and "x-mac-hebrew" are two different proper supersets of
// these code points. windows-1255 defines additional characters in the range
// 0x80-0x9F as some misc punctuation marks as well as some Hebrew-specific
// diacritics and additional 'Yiddish' ligature letters in the range 0xc0-0xd6.
// x-mac-hebrew defines similar additional code points but with a different
// mapping.
//
// As far as an average Hebrew text with no diacritics is concerned, all four
// charsets are identical with respect to code points. Meaning that for the
// main Hebrew alphabet, all four map the same values to all 27 Hebrew letters
// (including final letters).
//
// The dominant difference between these charsets is their directionality.
// "Visual" directionality means that the text is ordered as if the renderer is
// not aware of a BIDI rendering algorithm. The renderer sees the text and
// draws it from left to right. The text itself when ordered naturally is read
// backwards. A buffer of Visual Hebrew generally looks like so:
// "[last word of first line spelled backwards] [whole line ordered backwards
// and spelled backwards] [first word of first line spelled backwards]
// [end of line] [last word of second line] ... etc' "
// adding punctuation marks, numbers and English text to visual text is
// naturally also "visual" and from left to right.
//
// "Logical" directionality means the text is ordered "naturally" according to
// the order it is read. It is the responsibility of the renderer to display
// the text from right to left. A BIDI algorithm is used to place general
// punctuation marks, numbers and English text in the text.
//
// Texts in x-mac-hebrew are almost impossible to find on the Internet. From
// what little evidence I could find, it seems that its general directionality
// is Logical.
//
// To sum up all of the above, the Hebrew probing mechanism knows about two
// charsets:
// Visual Hebrew - "ISO-8859-8" - backwards text - Words and sentences are
//    backwards while line order is natural. For charset recognition purposes
//    the line order is unimportant (In fact, for this implementation, even
//    word order is unimportant).
// Logical Hebrew - "windows-1255" - normal, naturally ordered text.
//
// "ISO-8859-8-I" is a subset of windows-1255 and doesn't need to be
//    specifically identified.
// "x-mac-hebrew" is also identified as windows-1255. A text in x-mac-hebrew
//    that contain special punctuation marks or diacritics is displayed with
//    some unconverted characters showing as question marks. This problem might
//    be corrected using another model prober for x-mac-hebrew. Due to the fact
//    that x-mac-hebrew texts are so rare, writing another model prober isn't
//    worth the effort and performance hit.
//
//////// The Prober ////////
//
// The prober is divided between two SBCharSetProbers and a HebrewProber,
// all of which are managed, created, fed data, inquired and deleted by the
// SBCSGroupProber. The two SBCharSetProbers identify that the text is in
// fact some kind of Hebrew, Logical or Visual. The final decision about which
// one is it is made by the HebrewProber by combining final-letter scores
// with the scores of the two SBCharSetProbers to produce a final answer.
//
// The SBCSGroupProber is responsible for stripping the original text of HTML
// tags, English characters, numbers, low-ASCII punctuation characters, spaces
// and new lines. It reduces any sequence of such characters to a single space.
// The buffer fed to each prober in the SBCS group prober is pure text in
// high-ASCII.
// The two SBCharSetProbers (model probers) share the same language model:
// Win1255Model.
// The first SBCharSetProber uses the model normally as any other
// SBCharSetProber does, to recognize windows-1255, upon which this model was
// built. The second SBCharSetProber is told to make the pair-of-letter
// lookup in the language model backwards. This in practice exactly simulates
// a visual Hebrew model using the windows-1255 logical Hebrew model.
//
// The HebrewProber is not using any language model. All it does is look for
// final-letter evidence suggesting the text is either logical Hebrew or visual
// Hebrew. Disjointed from the model probers, the results of the HebrewProber
// alone are meaningless. HebrewProber always returns 0.00 as confidence
// since it never identifies a charset by itself. Instead, the pointer to the
// HebrewProber is passed to the model probers as a helper "Name Prober".
// When the Group prober receives a positive identification from any prober,
// it asks for the name of the charset identified. If the prober queried is a
// Hebrew model prober, the model prober forwards the call to the
// HebrewProber to make the final decision. In the HebrewProber, the
// decision is made according to the final-letters scores maintained and Both
// model probers scores. The answer is returned in the form of the name of the
// charset identified, either "windows-1255" or "ISO-8859-8".

jschardet.HebrewProber = function() {
    jschardet.CharSetProber.apply(this);

    // windows-1255 / ISO-8859-8 code points of interest
    var FINAL_KAF = '\xea'
    var NORMAL_KAF = '\xeb'
    var FINAL_MEM = '\xed'
    var NORMAL_MEM = '\xee'
    var FINAL_NUN = '\xef'
    var NORMAL_NUN = '\xf0'
    var FINAL_PE = '\xf3'
    var NORMAL_PE = '\xf4'
    var FINAL_TSADI = '\xf5'
    var NORMAL_TSADI = '\xf6'

    // Minimum Visual vs Logical final letter score difference.
    // If the difference is below this, don't rely solely on the final letter score distance.
    var MIN_FINAL_CHAR_DISTANCE = 5

    // Minimum Visual vs Logical model score difference.
    // If the difference is below this, don't rely at all on the model score distance.
    var MIN_MODEL_DISTANCE = 0.01

    var VISUAL_HEBREW_NAME = "ISO-8859-8"
    var LOGICAL_HEBREW_NAME = "windows-1255"
    var self = this;

    function init() {
        self._mLogicalProber = null;
        self._mVisualProber = null;
        self.reset();
    }

    this.reset = function() {
        this._mFinalCharLogicalScore = 0;
        this._mFinalCharVisualScore = 0;
        // The two last characters seen in the previous buffer,
        // mPrev and mBeforePrev are initialized to space in order to simulate a word
        // delimiter at the beginning of the data
        this._mPrev = " ";
        this._mBeforePrev = " ";
        // These probers are owned by the group prober.
    }

    this.setModelProbers = function(logicalProber, visualProber) {
        this._mLogicalProber = logicalProber;
        this._mVisualProber = visualProber;
    }

    this.isFinal = function(c) {
        return [FINAL_KAF, FINAL_MEM, FINAL_NUN, FINAL_PE, FINAL_TSADI].indexOf(c) != -1;
    }

    this.isNonFinal = function(c) {
        // The normal Tsadi is not a good Non-Final letter due to words like
        // 'lechotet' (to chat) containing an apostrophe after the tsadi. This
        // apostrophe is converted to a space in FilterWithoutEnglishLetters causing
        // the Non-Final tsadi to appear at an end of a word even though this is not
        // the case in the original text.
        // The letters Pe and Kaf rarely display a related behavior of not being a
        // good Non-Final letter. Words like 'Pop', 'Winamp' and 'Mubarak' for
        // example legally end with a Non-Final Pe or Kaf. However, the benefit of
        // these letters as Non-Final letters outweighs the damage since these words
        // are quite rare.
        return [NORMAL_KAF, NORMAL_MEM, NORMAL_NUN, NORMAL_PE].indexOf(c) != -1;
    }

    this.feed = function(aBuf) {
        // Final letter analysis for logical-visual decision.
        // Look for evidence that the received buffer is either logical Hebrew or
        // visual Hebrew.
        // The following cases are checked:
        // 1) A word longer than 1 letter, ending with a final letter. This is an
        //    indication that the text is laid out "naturally" since the final letter
        //    really appears at the end. +1 for logical score.
        // 2) A word longer than 1 letter, ending with a Non-Final letter. In normal
        //    Hebrew, words ending with Kaf, Mem, Nun, Pe or Tsadi, should not end with
        //    the Non-Final form of that letter. Exceptions to this rule are mentioned
        //    above in isNonFinal(). This is an indication that the text is laid out
        //    backwards. +1 for visual score
        // 3) A word longer than 1 letter, starting with a final letter. Final letters
        //    should not appear at the beginning of a word. This is an indication that
        //    the text is laid out backwards. +1 for visual score.
        //
        // The visual score and logical score are accumulated throughout the text and
        // are finally checked against each other in GetCharSetName().
        // No checking for final letters in the middle of words is done since that case
        // is not an indication for either Logical or Visual text.
        //
        // We automatically filter out all 7-bit characters (replace them with spaces)
        // so the word boundary detection works properly. [MAP]

        if( this.getState() == jschardet.Constants.notMe ) {
            // Both model probers say it's not them. No reason to continue.
            return jschardet.Constants.notMe;
        }

        aBuf = this.filterHighBitOnly(aBuf);

        for( var i = 0, cur; i < aBuf.length; i++ ) {
            cur = aBuf[i];
            if( cur == " " ) {
                // We stand on a space - a word just ended
                if( this._mBeforePrev != " " ) {
                    // next-to-last char was not a space so self._mPrev is not a 1 letter word
                    if( this.isFinal(this._mPrev) ) {
                        // case (1) [-2:not space][-1:final letter][cur:space]
                        this._mFinalCharLogicalScore++;
                    } else if( this.isNonFinal(this._mPrev) ) {
                        // case (2) [-2:not space][-1:Non-Final letter][cur:space]
                        this._mFinalCharVisualScore++;
                    }
                }
            } else {
                // Not standing on a space
                if( this._mBeforePrev == " " && this.isFinal(this._mPrev) && cur != " " ) {
                    // case (3) [-2:space][-1:final letter][cur:not space]
                    this._mFinalCharVisualScore++;
                }
            }
            this._mBeforePrev = this._mPrev;
            this._mPrev = cur;
        }
        // Forever detecting, till the end or until both model probers return eNotMe (handled above)
        return jschardet.Constants.detecting;
    }

    this.getCharsetName = function() {
        // Make the decision: is it Logical or Visual?
        // If the final letter score distance is dominant enough, rely on it.
        var finalsub = this._mFinalCharLogicalScore - this._mFinalCharVisualScore;
        if( finalsub >= MIN_FINAL_CHAR_DISTANCE ) {
            return LOGICAL_HEBREW_NAME;
        }
        if( finalsub <= -MIN_FINAL_CHAR_DISTANCE ) {
            return VISUAL_HEBREW_NAME;
        }

        // It's not dominant enough, try to rely on the model scores instead.
        var modelsub = this._mLogicalProber.getConfidence() - this._mVisualProber.getConfidence();
        if( modelsub > MIN_MODEL_DISTANCE ) {
            return LOGICAL_HEBREW_NAME;
        }
        if( modelsub < -MIN_MODEL_DISTANCE ) {
            return VISUAL_HEBREW_NAME;
        }

        // Still no good, back to final letter distance, maybe it'll save the day.
        if( finalsub < 0 ) {
            return VISUAL_HEBREW_NAME;
        }

        // (finalsub > 0 - Logical) or (don't know what to do) default to Logical.
        return LOGICAL_HEBREW_NAME;
    }

    this.getState = function() {
        // Remain active as long as any of the model probers are active.
        if( this._mLogicalProber.getState() == jschardet.Constants.notMe &&
            this._mVisualProber.getState() == jschardet.Constants.notMe ) {
            return jschardet.Constants.notMe;
        }
        return jschardet.Constants.detecting;
    }

    init();
}
jschardet.HebrewProber.prototype = new jschardet.CharSetProber();

// https://developer.mozilla.org/En/Core_JavaScript_1.5_Reference/Objects/Array/IndexOf
if (!Array.prototype.indexOf)
{
    Array.prototype.indexOf = function(elt /*, from*/)
    {
        var len = this.length >>> 0;

        var from = Number(arguments[1]) || 0;
        from = (from < 0)
             ? Math.ceil(from)
             : Math.floor(from);
        if (from < 0)
            from += len;

        for (; from < len; from++)
        {
            if (from in this &&
                this[from] === elt)
                return from;
        }
        return -1;
    };
}
/*
 * The Original Code is Mozilla Universal charset detector code.
 *
 * The Initial Developer of the Original Code is
 * Netscape Communications Corporation.
 * Portions created by the Initial Developer are Copyright (C) 2001
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   António Afonso (antonio.afonso gmail.com) - port to JavaScript
 *   Mark Pilgrim - port to Python
 *   Shy Shalom - original C code
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301  USA
 */

// 255: Control characters that usually does not exist in any text
// 254: Carriage/Return
// 253: symbol (punctuation) that does not belong to word
// 252: 0 - 9

// Windows-1255 language model
// Character Mapping Table:
jschardet.win1255_CharToOrderMap = [
255,255,255,255,255,255,255,255,255,255,254,255,255,254,255,255,  // 00
255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,  // 10
253,253,253,253,253,253,253,253,253,253,253,253,253,253,253,253,  // 20
252,252,252,252,252,252,252,252,252,252,253,253,253,253,253,253,  // 30
253, 69, 91, 79, 80, 92, 89, 97, 90, 68,111,112, 82, 73, 95, 85,  // 40
 78,121, 86, 71, 67,102,107, 84,114,103,115,253,253,253,253,253,  // 50
253, 50, 74, 60, 61, 42, 76, 70, 64, 53,105, 93, 56, 65, 54, 49,  // 60
 66,110, 51, 43, 44, 63, 81, 77, 98, 75,108,253,253,253,253,253,  // 70
124,202,203,204,205, 40, 58,206,207,208,209,210,211,212,213,214,
215, 83, 52, 47, 46, 72, 32, 94,216,113,217,109,218,219,220,221,
 34,116,222,118,100,223,224,117,119,104,125,225,226, 87, 99,227,
106,122,123,228, 55,229,230,101,231,232,120,233, 48, 39, 57,234,
 30, 59, 41, 88, 33, 37, 36, 31, 29, 35,235, 62, 28,236,126,237,
238, 38, 45,239,240,241,242,243,127,244,245,246,247,248,249,250,
  9,  8, 20, 16,  3,  2, 24, 14, 22,  1, 25, 15,  4, 11,  6, 23,
 12, 19, 13, 26, 18, 27, 21, 17,  7, 10,  5,251,252,128, 96,253
];

// Model Table:
// total sequences: 100%
// first 512 sequences: 98.4004%
// first 1024 sequences: 1.5981%
// rest  sequences:      0.087%
// negative sequences:   0.0015%
jschardet.HebrewLangModel = [
0,3,3,3,3,3,3,3,3,3,3,2,3,3,3,3,3,3,3,3,3,3,3,2,3,2,1,2,0,1,0,0,
3,0,3,1,0,0,1,3,2,0,1,1,2,0,2,2,2,1,1,1,1,2,1,1,1,2,0,0,2,2,0,1,
3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,2,2,
1,2,1,2,1,2,0,0,2,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,
3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,2,
1,2,1,3,1,1,0,0,2,0,0,0,1,0,1,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,
3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1,0,1,2,2,1,3,
1,2,1,1,2,2,0,0,2,2,0,0,0,0,1,0,1,0,0,0,1,0,0,0,0,0,0,1,0,1,1,0,
3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,3,3,2,2,2,2,3,2,
1,2,1,2,2,2,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,
3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,3,3,2,3,2,2,3,2,2,2,1,2,2,2,2,
1,2,1,1,2,2,0,1,2,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,
3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,0,2,2,2,2,2,
0,2,0,2,2,2,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,
3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,3,0,2,2,2,
0,2,1,2,2,2,0,0,2,1,0,0,0,0,1,0,1,0,0,0,0,0,0,2,0,0,0,0,0,0,1,0,
3,3,3,3,3,3,3,3,3,3,3,2,3,3,3,3,3,3,3,3,3,3,3,3,3,2,1,2,3,2,2,2,
1,2,1,2,2,2,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,1,0,
3,3,3,3,3,3,3,3,3,2,3,3,3,2,3,3,3,3,3,3,3,3,3,3,3,3,3,1,0,2,0,2,
0,2,1,2,2,2,0,0,1,2,0,0,0,0,1,0,1,0,0,0,0,0,0,1,0,0,0,2,0,0,1,0,
3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,3,2,3,2,2,3,2,1,2,1,1,1,
0,1,1,1,1,1,3,0,1,0,0,0,0,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,
3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,0,1,0,0,1,0,0,0,0,
0,0,1,0,0,0,0,0,2,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,2,2,2,2,2,
0,2,0,1,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,
3,3,3,3,3,3,3,3,3,2,3,3,3,2,1,2,3,3,2,3,3,3,3,2,3,2,1,2,0,2,1,2,
0,2,0,2,2,2,0,0,1,2,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,
3,3,3,3,3,3,3,3,3,2,3,3,3,1,2,2,3,3,2,3,2,3,2,2,3,1,2,2,0,2,2,2,
0,2,1,2,2,2,0,0,1,2,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,1,0,0,1,0,
3,3,3,3,3,3,3,3,3,3,3,3,3,2,3,3,3,2,3,3,2,2,2,3,3,3,3,1,3,2,2,2,
0,2,0,1,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,
3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,3,3,3,2,3,2,2,2,1,2,2,0,2,2,2,2,
0,2,0,2,2,2,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,
3,3,3,3,3,3,3,3,3,3,3,2,3,3,3,1,3,2,3,3,2,3,3,2,2,1,2,2,2,2,2,2,
0,2,1,2,1,2,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,1,0,
3,3,3,3,3,3,2,3,2,3,3,2,3,3,3,3,2,3,2,3,3,3,3,3,2,2,2,2,2,2,2,1,
0,2,0,1,2,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,
3,3,3,3,3,3,3,3,3,2,1,2,3,3,3,3,3,3,3,2,3,2,3,2,1,2,3,0,2,1,2,2,
0,2,1,1,2,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,2,0,
3,3,3,3,3,3,3,3,3,2,3,3,3,3,2,1,3,1,2,2,2,1,2,3,3,1,2,1,2,2,2,2,
0,1,1,1,1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,2,0,0,0,0,0,0,0,0,
3,3,3,3,3,3,3,3,3,3,0,2,3,3,3,1,3,3,3,1,2,2,2,2,1,1,2,2,2,2,2,2,
0,2,0,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,
3,3,3,3,3,3,2,3,3,3,2,2,3,3,3,2,1,2,3,2,3,2,2,2,2,1,2,1,1,1,2,2,
0,2,1,1,1,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,
3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,0,0,1,0,0,0,0,0,
1,0,1,0,0,0,0,0,2,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
3,3,3,3,3,2,3,3,2,3,1,2,2,2,2,3,2,3,1,1,2,2,1,2,2,1,1,0,2,2,2,2,
0,1,0,1,2,2,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,
3,0,0,1,1,0,1,0,0,1,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,0,
0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
3,0,1,0,1,0,1,1,0,1,1,0,0,0,1,1,0,1,1,1,0,0,0,0,0,0,1,0,0,0,0,0,
0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
3,0,0,0,1,1,0,1,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,
3,2,2,1,2,2,2,2,2,2,2,1,2,2,1,2,2,1,1,1,1,1,1,1,1,2,1,1,0,3,3,3,
0,3,0,2,2,2,2,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,
2,2,2,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,1,2,2,2,1,1,1,2,0,1,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,0,2,2,0,0,0,0,0,0,
0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
2,3,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,1,0,2,1,0,
0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
3,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,
0,3,1,1,2,2,2,2,2,1,2,2,2,1,1,2,2,2,2,2,2,2,1,2,2,1,0,1,1,1,1,0,
0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
3,2,1,1,1,1,2,1,1,2,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,0,0,0,0,0,0,0,
0,0,2,0,0,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0,0,1,0,0,
2,1,1,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,1,2,1,2,1,1,1,1,0,0,0,0,
0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
1,2,1,2,2,2,2,2,2,2,2,2,2,1,2,1,2,1,1,2,1,1,1,2,1,2,1,2,0,1,0,1,
0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,3,1,2,2,2,1,2,2,2,2,2,2,2,2,1,2,1,1,1,1,1,1,2,1,2,1,1,0,1,0,1,
0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
2,1,2,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,
0,2,0,1,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,
3,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
2,1,1,1,1,1,1,1,0,1,1,0,1,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,2,0,1,1,1,0,1,0,0,0,1,1,0,1,1,0,0,0,0,0,1,1,0,0,
0,1,1,1,2,1,2,2,2,0,2,0,2,0,1,1,2,1,1,1,1,2,1,0,1,1,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,
1,0,1,0,0,0,0,0,1,0,1,2,2,0,1,0,0,1,1,2,2,1,2,0,2,0,0,0,1,2,0,1,
2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,2,0,2,1,2,0,2,0,0,1,1,1,1,1,1,0,1,0,0,0,1,0,0,1,
2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,1,0,0,0,0,0,1,0,2,1,1,0,1,0,0,1,1,1,2,2,0,0,1,0,0,0,1,0,0,1,
1,1,2,1,0,1,1,1,0,1,0,1,1,1,1,0,0,0,1,0,1,0,0,0,0,0,0,0,0,2,2,1,
0,2,0,1,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
2,1,0,0,1,0,1,1,1,1,0,0,0,0,0,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
1,1,1,1,1,1,1,1,1,2,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,1,1,1,0,1,1,0,1,0,0,0,1,1,0,1,
2,0,1,0,1,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,1,0,1,1,1,0,1,0,0,1,1,2,1,1,2,0,1,0,0,0,1,1,0,1,
1,0,0,1,0,0,1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,1,0,1,1,2,0,1,0,0,0,0,2,1,1,2,0,2,0,0,0,1,1,0,1,
1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,1,0,2,1,1,0,1,0,0,2,2,1,2,1,1,0,1,0,0,0,1,1,0,1,
2,0,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,1,2,2,0,0,0,0,0,1,1,0,1,0,0,1,0,0,0,0,1,0,1,
1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,1,2,2,0,0,0,0,2,1,1,1,0,2,1,1,0,0,0,2,1,0,1,
1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,1,0,1,1,2,0,1,0,0,1,1,0,2,1,1,0,1,0,0,0,1,1,0,1,
2,2,1,1,1,0,1,1,0,1,1,0,1,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,1,0,2,1,1,0,1,0,0,1,1,0,1,2,1,0,2,0,0,0,1,1,0,1,
2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,
0,1,0,0,2,0,2,1,1,0,1,0,1,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,1,0,1,1,2,0,1,0,0,1,1,1,0,1,0,0,1,0,0,0,1,0,0,1,
1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
1,0,0,0,0,0,0,0,1,0,1,1,0,0,1,0,0,2,1,1,1,1,1,0,1,0,0,0,0,1,0,1,
0,1,1,1,2,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,1,2,1,0,0,0,0,0,1,1,1,1,1,0,1,0,0,0,1,1,0,0
];

jschardet.Win1255HebrewModel = {
    "charToOrderMap"        : jschardet.win1255_CharToOrderMap,
    "precedenceMatrix"      : jschardet.HebrewLangModel,
    "mTypicalPositiveRatio" : 0.984004,
    "keepEnglishLetter"     : false,
    "charsetName"           : "windows-1255"
};

/*
 * The Original Code is Mozilla Universal charset detector code.
 *
 * The Initial Developer of the Original Code is
 * Netscape Communications Corporation.
 * Portions created by the Initial Developer are Copyright (C) 2001
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   António Afonso (antonio.afonso gmail.com) - port to JavaScript
 *   Mark Pilgrim - port to Python
 *   Shy Shalom - original C code
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301  USA
 */

// 255: Control characters that usually does not exist in any text
// 254: Carriage/Return
// 253: symbol (punctuation) that does not belong to word
// 252: 0 - 9

// Character Mapping Table:
jschardet.Latin2_HungarianCharToOrderMap = [
255,255,255,255,255,255,255,255,255,255,254,255,255,254,255,255,  // 00
255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,  // 10
253,253,253,253,253,253,253,253,253,253,253,253,253,253,253,253,  // 20
252,252,252,252,252,252,252,252,252,252,253,253,253,253,253,253,  // 30
253, 28, 40, 54, 45, 32, 50, 49, 38, 39, 53, 36, 41, 34, 35, 47,
 46, 71, 43, 33, 37, 57, 48, 64, 68, 55, 52,253,253,253,253,253,
253,  2, 18, 26, 17,  1, 27, 12, 20,  9, 22,  7,  6, 13,  4,  8,
 23, 67, 10,  5,  3, 21, 19, 65, 62, 16, 11,253,253,253,253,253,
159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,
175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,
191,192,193,194,195,196,197, 75,198,199,200,201,202,203,204,205,
 79,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,
221, 51, 81,222, 78,223,224,225,226, 44,227,228,229, 61,230,231,
232,233,234, 58,235, 66, 59,236,237,238, 60, 69, 63,239,240,241,
 82, 14, 74,242, 70, 80,243, 72,244, 15, 83, 77, 84, 30, 76, 85,
245,246,247, 25, 73, 42, 24,248,249,250, 31, 56, 29,251,252,253
]

jschardet.win1250HungarianCharToOrderMap = [
255,255,255,255,255,255,255,255,255,255,254,255,255,254,255,255,  // 00
255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,  // 10
253,253,253,253,253,253,253,253,253,253,253,253,253,253,253,253,  // 20
252,252,252,252,252,252,252,252,252,252,253,253,253,253,253,253,  // 30
253, 28, 40, 54, 45, 32, 50, 49, 38, 39, 53, 36, 41, 34, 35, 47,
 46, 72, 43, 33, 37, 57, 48, 64, 68, 55, 52,253,253,253,253,253,
253,  2, 18, 26, 17,  1, 27, 12, 20,  9, 22,  7,  6, 13,  4,  8,
 23, 67, 10,  5,  3, 21, 19, 65, 62, 16, 11,253,253,253,253,253,
161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,
177,178,179,180, 78,181, 69,182,183,184,185,186,187,188,189,190,
191,192,193,194,195,196,197, 76,198,199,200,201,202,203,204,205,
 81,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,
221, 51, 83,222, 80,223,224,225,226, 44,227,228,229, 61,230,231,
232,233,234, 58,235, 66, 59,236,237,238, 60, 70, 63,239,240,241,
 84, 14, 75,242, 71, 82,243, 73,244, 15, 85, 79, 86, 30, 77, 87,
245,246,247, 25, 74, 42, 24,248,249,250, 31, 56, 29,251,252,253
];

// Model Table:
// total sequences: 100%
// first 512 sequences: 94.7368%
// first 1024 sequences:5.2623%
// rest  sequences:     0.8894%
// negative sequences:  0.0009%
jschardet.HungarianLangModel = [
0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,
3,3,3,3,3,3,3,3,3,3,2,3,3,3,3,3,3,3,3,2,2,3,3,1,1,2,2,2,2,2,1,2,
3,2,2,3,3,3,3,3,2,3,3,3,3,3,3,1,2,3,3,3,3,2,3,3,1,1,3,3,0,1,1,1,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,
3,2,1,3,3,3,3,3,2,3,3,3,3,3,1,1,2,3,3,3,3,3,3,3,1,1,3,2,0,1,1,1,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,
3,3,3,3,3,3,3,3,3,3,3,1,1,2,3,3,3,1,3,3,3,3,3,1,3,3,2,2,0,3,2,3,
0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,
3,3,3,3,3,3,2,3,3,3,2,3,3,2,3,3,3,3,3,2,3,3,2,2,3,2,3,2,0,3,2,2,
0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,
3,3,3,3,3,3,2,3,3,3,3,3,2,3,3,3,1,2,3,2,2,3,1,2,3,3,2,2,0,3,3,3,
0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,
3,3,3,3,3,3,3,3,3,3,2,2,3,3,3,3,3,3,2,3,3,3,3,2,3,3,3,3,0,2,3,2,
0,0,0,1,1,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,
3,3,3,3,3,3,3,3,3,3,3,1,1,1,3,3,2,1,3,2,2,3,2,1,3,2,2,1,0,3,3,1,
0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,
3,2,2,3,3,3,3,3,1,2,3,3,3,3,1,2,1,3,3,3,3,2,2,3,1,1,3,2,0,1,1,1,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,
3,3,3,3,3,3,3,3,2,2,3,3,3,3,3,2,1,3,3,3,3,3,2,2,1,3,3,3,0,1,1,2,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,
3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,3,3,3,2,3,3,2,3,3,3,2,0,3,2,3,
0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,1,0,
3,3,3,3,3,3,2,3,3,3,2,3,2,3,3,3,1,3,2,2,2,3,1,1,3,3,1,1,0,3,3,2,
0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,
3,3,3,3,3,3,3,2,3,3,3,2,3,2,3,3,3,2,3,3,3,3,3,1,2,3,2,2,0,2,2,2,
0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,
3,3,3,2,2,2,3,1,3,3,2,2,1,3,3,3,1,1,3,1,2,3,2,3,2,2,2,1,0,2,2,2,
0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,
3,1,1,3,3,3,3,3,1,2,3,3,3,3,1,2,1,3,3,3,2,2,3,2,1,0,3,2,0,1,1,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
3,1,1,3,3,3,3,3,1,2,3,3,3,3,1,1,0,3,3,3,3,0,2,3,0,0,2,1,0,1,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
3,3,3,3,3,3,2,2,3,3,2,2,2,2,3,3,0,1,2,3,2,3,2,2,3,2,1,2,0,2,2,2,
0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,
3,3,3,3,3,3,1,2,3,3,3,2,1,2,3,3,2,2,2,3,2,3,3,1,3,3,1,1,0,2,3,2,
0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,
3,3,3,1,2,2,2,2,3,3,3,1,1,1,3,3,1,1,3,1,1,3,2,1,2,3,1,1,0,2,2,2,
0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,
3,3,3,2,1,2,1,1,3,3,1,1,1,1,3,3,1,1,2,2,1,2,1,1,2,2,1,1,0,2,2,1,
0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,
3,3,3,1,1,2,1,1,3,3,1,0,1,1,3,3,2,0,1,1,2,3,1,0,2,2,1,0,0,1,3,2,
0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,
3,2,1,3,3,3,3,3,1,2,3,2,3,3,2,1,1,3,2,3,2,1,2,2,0,1,2,1,0,0,1,1,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,
3,3,3,3,2,2,2,2,3,1,2,2,1,1,3,3,0,3,2,1,2,3,2,1,3,3,1,1,0,2,1,3,
0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,
3,3,3,2,2,2,3,2,3,3,3,2,1,1,3,3,1,1,1,2,2,3,2,3,2,2,2,1,0,2,2,1,
0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,
1,0,0,3,3,3,3,3,0,0,3,3,2,3,0,0,0,2,3,3,1,0,1,2,0,0,1,1,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
3,1,2,3,3,3,3,3,1,2,3,3,2,2,1,1,0,3,3,2,2,1,2,2,1,0,2,2,0,1,1,1,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
3,3,2,2,1,3,1,2,3,3,2,2,1,1,2,2,1,1,1,1,3,2,1,1,1,1,2,1,0,1,2,1,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,
2,3,3,1,1,1,1,1,3,3,3,0,1,1,3,3,1,1,1,1,1,2,2,0,3,1,1,2,0,2,1,1,
0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,
3,1,0,1,2,1,2,2,0,1,2,3,1,2,0,0,0,2,1,1,1,1,1,2,0,0,1,1,0,0,0,0,
1,2,1,2,2,2,1,2,1,2,0,2,0,2,2,1,1,2,1,1,2,1,1,1,0,1,0,0,0,1,1,0,
1,1,1,2,3,2,3,3,0,1,2,2,3,1,0,1,0,2,1,2,2,0,1,1,0,0,1,1,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
1,0,0,3,3,2,2,1,0,0,3,2,3,2,0,0,0,1,1,3,0,0,1,1,0,0,2,1,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
3,1,1,2,2,3,3,1,0,1,3,2,3,1,1,1,0,1,1,1,1,1,3,1,0,0,2,2,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
3,1,1,1,2,2,2,1,0,1,2,3,3,2,0,0,0,2,1,1,1,2,1,1,1,0,1,1,1,0,0,0,
1,2,2,2,2,2,1,1,1,2,0,2,1,1,1,1,1,2,1,1,1,1,1,1,0,1,1,1,0,0,1,1,
3,2,2,1,0,0,1,1,2,2,0,3,0,1,2,1,1,0,0,1,1,1,0,1,1,1,1,0,2,1,1,1,
2,2,1,1,1,2,1,2,1,1,1,1,1,1,1,2,1,1,1,2,3,1,1,1,1,1,1,1,1,1,0,1,
2,3,3,0,1,0,0,0,3,3,1,0,0,1,2,2,1,0,0,0,0,2,0,0,1,1,1,0,2,1,1,1,
2,1,1,1,1,1,1,2,1,1,0,1,1,0,1,1,1,0,1,2,1,1,0,1,1,1,1,1,1,1,0,1,
2,3,3,0,1,0,0,0,2,2,0,0,0,0,1,2,2,0,0,0,0,1,0,0,1,1,0,0,2,0,1,0,
2,1,1,1,1,2,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,2,0,1,1,1,1,1,0,1,
3,2,2,0,1,0,1,0,2,3,2,0,0,1,2,2,1,0,0,1,1,1,0,0,2,1,0,1,2,2,1,1,
2,1,1,1,1,1,1,2,1,1,1,1,1,1,0,2,1,0,1,1,0,1,1,1,0,1,1,2,1,1,0,1,
2,2,2,0,0,1,0,0,2,2,1,1,0,0,2,1,1,0,0,0,1,2,0,0,2,1,0,0,2,1,1,1,
2,1,1,1,1,2,1,2,1,1,1,2,2,1,1,2,1,1,1,2,1,1,1,1,1,1,1,1,1,1,0,1,
1,2,3,0,0,0,1,0,3,2,1,0,0,1,2,1,1,0,0,0,0,2,1,0,1,1,0,0,2,1,2,1,
1,1,0,0,0,1,0,1,1,1,1,1,2,0,0,1,0,0,0,2,0,0,1,1,1,1,1,1,1,1,0,1,
3,0,0,2,1,2,2,1,0,0,2,1,2,2,0,0,0,2,1,1,1,0,1,1,0,0,1,1,2,0,0,0,
1,2,1,2,2,1,1,2,1,2,0,1,1,1,1,1,1,1,1,1,2,1,1,0,0,1,1,1,1,0,0,1,
1,3,2,0,0,0,1,0,2,2,2,0,0,0,2,2,1,0,0,0,0,3,1,1,1,1,0,0,2,1,1,1,
2,1,0,1,1,1,0,1,1,1,1,1,1,1,0,2,1,0,0,1,0,1,1,0,1,1,1,1,1,1,0,1,
2,3,2,0,0,0,1,0,2,2,0,0,0,0,2,1,1,0,0,0,0,2,1,0,1,1,0,0,2,1,1,0,
2,1,1,1,1,2,1,2,1,2,0,1,1,1,0,2,1,1,1,2,1,1,1,1,0,1,1,1,1,1,0,1,
3,1,1,2,2,2,3,2,1,1,2,2,1,1,0,1,0,2,2,1,1,1,1,1,0,0,1,1,0,1,1,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
2,2,2,0,0,0,0,0,2,2,0,0,0,0,2,2,1,0,0,0,1,1,0,0,1,2,0,0,2,1,1,1,
2,2,1,1,1,2,1,2,1,1,0,1,1,1,1,2,1,1,1,2,1,1,1,1,0,1,2,1,1,1,0,1,
1,0,0,1,2,3,2,1,0,0,2,0,1,1,0,0,0,1,1,1,1,0,1,1,0,0,1,0,0,0,0,0,
1,2,1,2,1,2,1,1,1,2,0,2,1,1,1,0,1,2,0,0,1,1,1,0,0,0,0,0,0,0,0,0,
2,3,2,0,0,0,0,0,1,1,2,1,0,0,1,1,1,0,0,0,0,2,0,0,1,1,0,0,2,1,1,1,
2,1,1,1,1,1,1,2,1,0,1,1,1,1,0,2,1,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,
1,2,2,0,1,1,1,0,2,2,2,0,0,0,3,2,1,0,0,0,1,1,0,0,1,1,0,1,1,1,0,0,
1,1,0,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,2,1,1,1,0,0,1,1,1,0,1,0,1,
2,1,0,2,1,1,2,2,1,1,2,1,1,1,0,0,0,1,1,0,1,1,1,1,0,0,1,1,1,0,0,0,
1,2,2,2,2,2,1,1,1,2,0,2,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,0,0,1,0,
1,2,3,0,0,0,1,0,2,2,0,0,0,0,2,2,0,0,0,0,0,1,0,0,1,0,0,0,2,0,1,0,
2,1,1,1,1,1,0,2,0,0,0,1,2,1,1,1,1,0,1,2,0,1,0,1,0,1,1,1,0,1,0,1,
2,2,2,0,0,0,1,0,2,1,2,0,0,0,1,1,2,0,0,0,0,1,0,0,1,1,0,0,2,1,0,1,
2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,1,1,1,1,1,0,1,
1,2,2,0,0,0,1,0,2,2,2,0,0,0,1,1,0,0,0,0,0,1,1,0,2,0,0,1,1,1,0,1,
1,0,1,1,1,1,1,1,0,1,1,1,1,0,0,1,0,0,1,1,0,1,0,1,1,1,1,1,0,0,0,1,
1,0,0,1,0,1,2,1,0,0,1,1,1,2,0,0,0,1,1,0,1,0,1,1,0,0,1,0,0,0,0,0,
0,2,1,2,1,1,1,1,1,2,0,2,0,1,1,0,1,2,1,0,1,1,1,0,0,0,0,0,0,1,0,0,
2,1,1,0,1,2,0,0,1,1,1,0,0,0,1,1,0,0,0,0,0,1,0,0,1,0,0,0,2,1,0,1,
2,2,1,1,1,1,1,2,1,1,0,1,1,1,1,2,1,1,1,2,1,1,0,1,0,1,1,1,1,1,0,1,
1,2,2,0,0,0,0,0,1,1,0,0,0,0,2,1,0,0,0,0,0,2,0,0,2,2,0,0,2,0,0,1,
2,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,0,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,
1,1,2,0,0,3,1,0,2,1,1,1,0,0,1,1,1,0,0,0,1,1,0,0,0,1,0,0,1,0,1,0,
1,2,1,0,1,1,1,2,1,1,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,1,0,0,0,1,0,0,
2,1,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,1,0,0,0,1,0,0,0,0,2,0,0,0,
2,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,2,1,1,0,0,1,1,1,1,1,0,1,
2,1,1,1,2,1,1,1,0,1,1,2,1,0,0,0,0,1,1,1,1,0,1,0,0,0,0,1,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
1,1,0,1,1,1,1,1,0,0,1,1,2,1,0,0,0,1,1,0,0,0,1,1,0,0,1,0,1,0,0,0,
1,2,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,0,1,1,1,0,0,0,0,0,0,1,0,0,
2,0,0,0,1,1,1,1,0,0,1,1,0,0,0,0,0,1,1,1,2,0,0,1,0,0,1,0,1,0,0,0,
0,1,1,1,1,1,1,1,1,2,0,1,1,1,1,0,1,1,1,0,1,1,1,0,0,0,0,0,0,0,0,0,
1,0,0,1,1,1,1,1,0,0,2,1,0,1,0,0,0,1,0,1,0,0,0,0,0,0,1,0,0,0,0,0,
0,1,1,1,1,1,1,0,1,1,0,1,0,1,1,0,1,1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,
1,0,0,1,1,1,0,0,0,0,1,0,2,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,
0,1,1,1,1,1,0,0,1,1,0,1,0,1,0,0,1,1,1,0,1,1,1,0,0,0,0,0,0,0,0,0,
0,0,0,1,0,0,0,0,0,0,1,1,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,1,1,1,0,1,0,0,1,1,0,1,0,1,1,0,1,1,1,0,1,1,1,0,0,0,0,0,0,0,0,0,
2,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,0,0,1,0,0,1,0,1,0,1,1,1,0,0,1,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
1,0,0,1,1,1,1,0,0,0,1,1,1,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,
0,1,1,1,1,1,1,0,1,1,0,1,0,1,0,0,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0
];

jschardet.Latin2HungarianModel = {
    "charToOrderMap"        : jschardet.Latin2_HungarianCharToOrderMap,
    "precedenceMatrix"      : jschardet.HungarianLangModel,
    "mTypicalPositiveRatio" : 0.947368,
    "keepEnglishLetter"     : true,
    "charsetName"           : "ISO-8859-2"
};

jschardet.Win1250HungarianModel = {
    "charToOrderMap"        : jschardet.win1250HungarianCharToOrderMap,
    "precedenceMatrix"      : jschardet.HungarianLangModel,
    "mTypicalPositiveRatio" : 0.947368,
    "keepEnglishLetter"     : true,
    "charsetName"           : "windows-1250"
};

/*
 * The Original Code is Mozilla Universal charset detector code.
 *
 * The Initial Developer of the Original Code is
 * Netscape Communications Corporation.
 * Portions created by the Initial Developer are Copyright (C) 2001
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   António Afonso (antonio.afonso gmail.com) - port to JavaScript
 *   Mark Pilgrim - port to Python
 *   Shy Shalom - original C code
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301  USA
 */

jschardet.SBCSGroupProber = function() {
    jschardet.CharSetGroupProber.apply(this);

    var self = this;

    function init() {
        self._mProbers = [
            new jschardet.SingleByteCharSetProber(jschardet.Win1251CyrillicModel),
            new jschardet.SingleByteCharSetProber(jschardet.Koi8rModel),
            new jschardet.SingleByteCharSetProber(jschardet.Latin5CyrillicModel),
            new jschardet.SingleByteCharSetProber(jschardet.MacCyrillicModel),
            new jschardet.SingleByteCharSetProber(jschardet.Ibm866Model),
            new jschardet.SingleByteCharSetProber(jschardet.Ibm855Model),
            new jschardet.SingleByteCharSetProber(jschardet.Latin7GreekModel),
            new jschardet.SingleByteCharSetProber(jschardet.Win1253GreekModel),
            new jschardet.SingleByteCharSetProber(jschardet.Latin5BulgarianModel),
            new jschardet.SingleByteCharSetProber(jschardet.Win1251BulgarianModel),
            new jschardet.SingleByteCharSetProber(jschardet.Latin2HungarianModel),
            new jschardet.SingleByteCharSetProber(jschardet.Win1250HungarianModel),
            new jschardet.SingleByteCharSetProber(jschardet.TIS620ThaiModel)
        ];
        var hebrewProber = new jschardet.HebrewProber();
        var logicalHebrewProber = new jschardet.SingleByteCharSetProber(jschardet.Win1255HebrewModel, false, hebrewProber);
        var visualHebrewProber = new jschardet.SingleByteCharSetProber(jschardet.Win1255HebrewModel, true, hebrewProber);
        hebrewProber.setModelProbers(logicalHebrewProber, visualHebrewProber);
        self._mProbers.push(hebrewProber, logicalHebrewProber, visualHebrewProber);

        self.reset();
    }

    init();
}
jschardet.SBCSGroupProber.prototype = new jschardet.CharSetGroupProber();

/*
 * The Original Code is Mozilla Universal charset detector code.
 *
 * The Initial Developer of the Original Code is
 * Netscape Communications Corporation.
 * Portions created by the Initial Developer are Copyright (C) 2001
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   António Afonso (antonio.afonso gmail.com) - port to JavaScript
 *   Mark Pilgrim - port to Python
 *   Shy Shalom - original C code
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301  USA
 */

(function() {
    var UDF = 0; // undefined
    var OTH = 1; // other
    jschardet.OTH = 1;
    var ASC = 2; // ascii capital letter
    var ASS = 3; // ascii small letter
    var ACV = 4; // accent capital vowel
    var ACO = 5; // accent capital other
    var ASV = 6; // accent small vowel
    var ASO = 7; // accent small other

    jschardet.Latin1_CharToClass = [
      OTH, OTH, OTH, OTH, OTH, OTH, OTH, OTH,   // 00 - 07
      OTH, OTH, OTH, OTH, OTH, OTH, OTH, OTH,   // 08 - 0F
      OTH, OTH, OTH, OTH, OTH, OTH, OTH, OTH,   // 10 - 17
      OTH, OTH, OTH, OTH, OTH, OTH, OTH, OTH,   // 18 - 1F
      OTH, OTH, OTH, OTH, OTH, OTH, OTH, OTH,   // 20 - 27
      OTH, OTH, OTH, OTH, OTH, OTH, OTH, OTH,   // 28 - 2F
      OTH, OTH, OTH, OTH, OTH, OTH, OTH, OTH,   // 30 - 37
      OTH, OTH, OTH, OTH, OTH, OTH, OTH, OTH,   // 38 - 3F
      OTH, ASC, ASC, ASC, ASC, ASC, ASC, ASC,   // 40 - 47
      ASC, ASC, ASC, ASC, ASC, ASC, ASC, ASC,   // 48 - 4F
      ASC, ASC, ASC, ASC, ASC, ASC, ASC, ASC,   // 50 - 57
      ASC, ASC, ASC, OTH, OTH, OTH, OTH, OTH,   // 58 - 5F
      OTH, ASS, ASS, ASS, ASS, ASS, ASS, ASS,   // 60 - 67
      ASS, ASS, ASS, ASS, ASS, ASS, ASS, ASS,   // 68 - 6F
      ASS, ASS, ASS, ASS, ASS, ASS, ASS, ASS,   // 70 - 77
      ASS, ASS, ASS, OTH, OTH, OTH, OTH, OTH,   // 78 - 7F
      OTH, UDF, OTH, ASO, OTH, OTH, OTH, OTH,   // 80 - 87
      OTH, OTH, ACO, OTH, ACO, UDF, ACO, UDF,   // 88 - 8F
      UDF, OTH, OTH, OTH, OTH, OTH, OTH, OTH,   // 90 - 97
      OTH, OTH, ASO, OTH, ASO, UDF, ASO, ACO,   // 98 - 9F
      OTH, OTH, OTH, OTH, OTH, OTH, OTH, OTH,   // A0 - A7
      OTH, OTH, OTH, OTH, OTH, OTH, OTH, OTH,   // A8 - AF
      OTH, OTH, OTH, OTH, OTH, OTH, OTH, OTH,   // B0 - B7
      OTH, OTH, OTH, OTH, OTH, OTH, OTH, OTH,   // B8 - BF
      ACV, ACV, ACV, ACV, ACV, ACV, ACO, ACO,   // C0 - C7
      ACV, ACV, ACV, ACV, ACV, ACV, ACV, ACV,   // C8 - CF
      ACO, ACO, ACV, ACV, ACV, ACV, ACV, OTH,   // D0 - D7
      ACV, ACV, ACV, ACV, ACV, ACO, ACO, ACO,   // D8 - DF
      ASV, ASV, ASV, ASV, ASV, ASV, ASO, ASO,   // E0 - E7
      ASV, ASV, ASV, ASV, ASV, ASV, ASV, ASV,   // E8 - EF
      ASO, ASO, ASV, ASV, ASV, ASV, ASV, OTH,   // F0 - F7
      ASV, ASV, ASV, ASV, ASV, ASO, ASO, ASO    // F8 - FF
    ];

    // 0 : illegal
    // 1 : very unlikely
    // 2 : normal
    // 3 : very likely
    jschardet.Latin1ClassModel = [
    // UDF OTH ASC ASS ACV ACO ASV ASO
       0,  0,  0,  0,  0,  0,  0,  0,  // UDF
       0,  3,  3,  3,  3,  3,  3,  3,  // OTH
       0,  3,  3,  3,  3,  3,  3,  3,  // ASC
       0,  3,  3,  3,  1,  1,  3,  3,  // ASS
       0,  3,  3,  3,  1,  2,  1,  2,  // ACV
       0,  3,  3,  3,  3,  3,  3,  3,  // ACO
       0,  3,  1,  3,  1,  1,  1,  3,  // ASV
       0,  3,  1,  3,  1,  1,  3,  3   // ASO
    ];
})();

jschardet.Latin1Prober = function() {
    jschardet.CharSetProber.apply(this);

    var FREQ_CAT_NUM = 4;
    var CLASS_NUM = 8; // total classes
    var self = this;

    function init() {
        self.reset();
    }

    this.reset = function() {
        this._mLastCharClass = jschardet.OTH;
        this._mFreqCounter = [];
        for( var i = 0; i < FREQ_CAT_NUM; this._mFreqCounter[i++] = 0 );
        jschardet.Latin1Prober.prototype.reset.apply(this);
    }

    this.getCharsetName = function() {
        return "windows-1252";
    }

    this.feed = function(aBuf) {
        aBuf = this.filterWithEnglishLetters(aBuf);
        for( var i = 0; i < aBuf.length; i++ ) {
            var c = aBuf.charCodeAt(i);
            var charClass = jschardet.Latin1_CharToClass[c];
            var freq = jschardet.Latin1ClassModel[(this._mLastCharClass * CLASS_NUM) + charClass];
            if( freq == 0 ) {
                this._mState = jschardet.Constants.notMe;
                break;
            }
            this._mFreqCounter[freq]++;
            this._mLastCharClass = charClass;
        }

        return this.getState();
    }

    this.getConfidence = function() {
        if( this.getState() == jschardet.Constants.notMe ) {
            return 0.01;
        }

        var total = 0;
        for( var i = 0; i < this._mFreqCounter.length; i++ ) {
            total += this._mFreqCounter[i];
        }
        if( total < 0.01 ) {
            constants = 0.0;
        } else {
            confidence = (this._mFreqCounter[3] / total) - (this._mFreqCounter[1] * 20 / total);
        }
        if( confidence < 0 ) {
            confidence = 0.0;
        }
        // lower the confidence of latin1 so that other more accurate detector
        // can take priority.
        //
        // antonio.afonso: need to change this otherwise languages like pt, es, fr using latin1 will never be detected.
        confidence = confidence * 0.95;
        return confidence;
    }

    init();
}
jschardet.Latin1Prober.prototype = new jschardet.CharSetProber();

/*
 * The Original Code is Mozilla Universal charset detector code.
 *
 * The Initial Developer of the Original Code is
 * Netscape Communications Corporation.
 * Portions created by the Initial Developer are Copyright (C) 2001
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   António Afonso (antonio.afonso gmail.com) - port to JavaScript
 *   Mark Pilgrim - port to Python
 *   Shy Shalom - original C code
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301  USA
 */

jschardet.EscCharSetProber = function() {
    jschardet.CharSetProber.apply(this);

    var self = this;

    function init() {
        self._mCodingSM = [
            new jschardet.CodingStateMachine(jschardet.HZSMModel),
            new jschardet.CodingStateMachine(jschardet.ISO2022CNSMModel),
            new jschardet.CodingStateMachine(jschardet.ISO2022JPSMModel),
            new jschardet.CodingStateMachine(jschardet.ISO2022KRSMModel)
        ];
        self.reset();
    }

    this.reset = function() {
        jschardet.EscCharSetProber.prototype.reset.apply(this);
        for( var i = 0, codingSM; codingSM = this._mCodingSM[i]; i++ ) {
            if( !codingSM ) continue;
            codingSM.active = true;
            codingSM.reset();
        }
        this._mActiveSM = self._mCodingSM.length;
        this._mDetectedCharset = null;
    }

    this.getCharsetName = function() {
        return this._mDetectedCharset;
    }

    this.getConfidence = function() {
        if( this._mDetectedCharset ) {
            return 0.99;
        } else {
            return 0.00;
        }
    }

    this.feed = function(aBuf) {
        for( var i = 0, c; i < aBuf.length; i++ ) {
            c = aBuf[i];
            for( var j = 0, codingSM; codingSM = this._mCodingSM[j]; j++ ) {
                if( !codingSM || !codingSM.active ) continue;
                var codingState = codingSM.nextState(c);
                if( codingState == jschardet.Constants.error ) {
                    codingSM.active = false;
                    this._mActiveSM--;
                    if( this._mActiveSM <= 0 ) {
                        this._mState = jschardet.Constants.notMe;
                        return this.getState();
                    }
                } else if( codingState == jschardet.Constants.itsMe ) {
                    this._mState = jschardet.Constants.foundIt;
                    this._mDetectedCharset = codingSM.getCodingStateMachine();
                    return this.getState();
                }
            }
        }

        return this.getState();
    }

    init();
}
jschardet.EscCharSetProber.prototype = new jschardet.CharSetProber();
/*
 * The Original Code is Mozilla Universal charset detector code.
 *
 * The Initial Developer of the Original Code is
 * Netscape Communications Corporation.
 * Portions created by the Initial Developer are Copyright (C) 2001
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   António Afonso (antonio.afonso gmail.com) - port to JavaScript
 *   Mark Pilgrim - port to Python
 *   Shy Shalom - original C code
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301  USA
 */

/**
 * This is a port from the python port, version "2.0.1"
 */
jschardet.UniversalDetector = function() {
    var MINIMUM_THRESHOLD = 0.20;
    var _state = {
        pureAscii   : 0,
        escAscii    : 1,
        highbyte    : 2
    };
    var self = this;

    function init() {
        self._highBitDetector = /[\x80-\xFF]/;
        self._escDetector = /(\x1B|~\{)/;
        self._mEscCharsetProber = null;
        self._mCharsetProbers = [];
        self.reset();
    }

    this.reset = function() {
        this.result = {"encoding": null, "confidence": 0.0};
        this.done = false;
        this._mStart = true;
        this._mGotData = false;
        this._mInputState = _state.pureAscii;
        this._mLastChar = "";
        if( this._mEscCharsetProber ) {
            this._mEscCharsetProber.reset();
        }
        for( var i = 0, prober; prober = this._mCharsetProbers[i]; i++ ) {
            prober.reset();
        }
    }

    this.feed = function(aBuf) {
        if( this.done ) return;

        var aLen = aBuf.length;
        if( !aLen ) return;

        if( !this._mGotData ) {
            // If the data starts with BOM, we know it is UTF
            if( aBuf.slice(0,3) == "\xEF\xBB\xBF" ) {
                // EF BB BF  UTF-8 with BOM
                this.result = {"encoding": "UTF-8", "confidence": 1.0};
            } else if( aBuf.slice(0,4) == "\xFF\xFE\x00\x00" ) {
                // FF FE 00 00  UTF-32, little-endian BOM
                this.result = {"encoding": "UTF-32LE", "confidence": 1.0};
            } else if( aBuf.slice(0,4) == "\x00\x00\xFE\xFF" ) {
                // 00 00 FE FF  UTF-32, big-endian BOM
                this.result = {"encoding": "UTF-32BE", "confidence": 1.0};
            } else if( aBuf.slice(0,4) == "\xFE\xFF\x00\x00" ) {
                // FE FF 00 00  UCS-4, unusual octet order BOM (3412)
                this.result = {"encoding": "X-ISO-10646-UCS-4-3412", "confidence": 1.0};
            } else if( aBuf.slice(0,4) == "\x00\x00\xFF\xFE" ) {
                // 00 00 FF FE  UCS-4, unusual octet order BOM (2143)
                this.result = {"encoding": "X-ISO-10646-UCS-4-2143", "confidence": 1.0};
            } else if( aBuf.slice(0,2) == "\xFF\xFE" ) {
                // FF FE  UTF-16, little endian BOM
                this.result = {"encoding": "UTF-16LE", "confidence": 1.0};
            } else if( aBuf.slice(0,2) == "\xFE\xFF" ) {
                // FE FF  UTF-16, big endian BOM
                this.result = {"encoding": "UTF-16BE", "confidence": 1.0};
            }
        }

        this._mGotData = true;
        if( this.result.encoding && (this.result.confidence > 0.0) ) {
            this.done = true;
            return;
        }

        if( this._mInputState == _state.pureAscii ) {
            if( this._highBitDetector.test(aBuf) ) {
                this._mInputState = _state.highbyte;
            } else if( this._escDetector.test(this._mLastChar + aBuf) ) {
                this._mInputState = _state.escAscii;
            }
        }

        this._mLastChar = aBuf.slice(-1);

        if( this._mInputState == _state.escAscii ) {
            if( !this._mEscCharsetProber ) {
                this._mEscCharsetProber = new jschardet.EscCharSetProber();
            }
            if( this._mEscCharsetProber.feed(aBuf) == jschardet.Constants.foundIt ) {
                this.result = {
                    "encoding": this._mEscCharsetProber.getCharsetName(),
                    "confidence": this._mEscCharsetProber.getConfidence()
                };
                this.done = true;
            }
        } else if( this._mInputState == _state.highbyte ) {
            if( this._mCharsetProbers.length == 0 ) {
                this._mCharsetProbers = [
                    new jschardet.MBCSGroupProber(),
                    new jschardet.SBCSGroupProber(),
                    new jschardet.Latin1Prober()
                ];
            }
            for( var i = 0, prober; prober = this._mCharsetProbers[i]; i++ ) {
                if( prober.feed(aBuf) == jschardet.Constants.foundIt ) {
                    this.result = {
                        "encoding": prober.getCharsetName(),
                        "confidence": prober.getConfidence()
                    };
                    this.done = true;
                    break;
                }
            }
        }
    }

    this.close = function() {
        if( this.done ) return;
        if( !this._mGotData ) {
            if( jschardet.Constants._debug ) {
                console.log("no data received!\n");
            }
            return;
        }
        this.done = true;

        if( this._mInputState == _state.pureAscii ) {
            this.result = {"encoding": "ascii", "confidence": 1.0};
            return this.result;
        }

        if( this._mInputState == _state.highbyte ) {
            var proberConfidence = null;
            var maxProberConfidence = 0.0;
            var maxProber = null;
            for( var i = 0, prober; prober = this._mCharsetProbers[i]; i++ ) {
                if( !prober ) continue;
                proberConfidence = prober.getConfidence();
                if( proberConfidence > maxProberConfidence ) {
                    maxProberConfidence = proberConfidence;
                    maxProber = prober;
                }
                console.log(prober.getCharsetName() + " confidence " + prober.getConfidence())
            }
            if( maxProber && maxProberConfidence > MINIMUM_THRESHOLD ) {
                this.result = {
                    "encoding": maxProber.getCharsetName(),
                    "confidence": maxProber.getConfidence()
                };
                return this.result;
            }
        }

        if( jschardet.Constants._debug ) {
            console.log("no probers hit minimum threshhold\n");
            for( var i = 0, prober; prober = this._mCharsetProbers[i]; i++ ) {
                if( !prober ) continue;
                console.log(prober.getCharsetName() + " confidence = " +
                    prober.getConfidence() + "\n");
            }
        }
    }

    init();
};
//async.js
/*global setTimeout: false, console: false */(function(){var a={};var b=this,c=b.async;typeof module!=="undefined"&&module.exports?module.exports=a:b.async=a,a.noConflict=function(){b.async=c;return a};var d=function(a,b){if(a.forEach)return a.forEach(b);for(var c=0;c<a.length;c+=1)b(a[c],c,a)};var e=function(a,b){if(a.map)return a.map(b);var c=[];d(a,function(a,d,e){c.push(b(a,d,e))});return c};var f=function(a,b,c){if(a.reduce)return a.reduce(b,c);d(a,function(a,d,e){c=b(c,a,d,e)});return c};var g=function(a){if(Object.keys)return Object.keys(a);var b=[];for(var c in a)a.hasOwnProperty(c)&&b.push(c);return b};var h=function(a,b){if(a.indexOf)return a.indexOf(b);for(var c=0;c<a.length;c+=1)if(a[c]===b)return c;return-1};typeof process==="undefined"||!process.nextTick?a.nextTick=function(a){setTimeout(a,0)}:a.nextTick=process.nextTick,a.forEach=function(a,b,c){if(!a.length)return c();var e=0;d(a,function(d){b(d,function(b){b?(c(b),c=function(){}):(e+=1,e===a.length&&c())})})},a.forEachSeries=function(a,b,c){if(!a.length)return c();var d=0;var e=function(){b(a[d],function(b){b?(c(b),c=function(){}):(d+=1,d===a.length?c():e())})};e()};var i=function(b){return function(){var c=Array.prototype.slice.call(arguments);return b.apply(null,[a.forEach].concat(c))}};var j=function(b){return function(){var c=Array.prototype.slice.call(arguments);return b.apply(null,[a.forEachSeries].concat(c))}};var k=function(a,b,c,d){var f=[];b=e(b,function(a,b){return{index:b,value:a}}),a(b,function(a,b){c(a.value,function(c,d){f[a.index]=d,b(c)})},function(a){d(a,f)})};a.map=i(k),a.mapSeries=j(k),a.reduce=function(b,c,d,e){a.forEachSeries(b,function(a,b){d(c,a,function(a,d){c=d,b(a)})},function(a){e(a,c)})},a.inject=a.reduce,a.foldl=a.reduce,a.reduceRight=function(b,c,d,f){var g=e(b,function(a){return a}).reverse();a.reduce(g,c,d,f)},a.foldr=a.reduceRight;var l=function(a,b,c,d){var f=[];b=e(b,function(a,b){return{index:b,value:a}}),a(b,function(a,b){c(a.value,function(c){c&&f.push(a),b()})},function(a){d(e(f.sort(function(a,b){return a.index-b.index}),function(a){return a.value}))})};a.filter=i(l),a.filterSeries=j(l),a.select=a.filter,a.selectSeries=a.filterSeries;var m=function(a,b,c,d){var f=[];b=e(b,function(a,b){return{index:b,value:a}}),a(b,function(a,b){c(a.value,function(c){c||f.push(a),b()})},function(a){d(e(f.sort(function(a,b){return a.index-b.index}),function(a){return a.value}))})};a.reject=i(m),a.rejectSeries=j(m);var n=function(a,b,c,d){a(b,function(a,b){c(a,function(c){c?(d(a),d=function(){}):b()})},function(a){d()})};a.detect=i(n),a.detectSeries=j(n),a.some=function(b,c,d){a.forEach(b,function(a,b){c(a,function(a){a&&(d(true),d=function(){}),b()})},function(a){d(false)})},a.any=a.some,a.every=function(b,c,d){a.forEach(b,function(a,b){c(a,function(a){a||(d(false),d=function(){}),b()})},function(a){d(true)})},a.all=a.every,a.sortBy=function(b,c,d){a.map(b,function(a,b){c(a,function(c,d){c?b(c):b(null,{value:a,criteria:d})})},function(a,b){if(a)return d(a);var c=function(a,b){var c=a.criteria,d=b.criteria;return c<d?-1:c>d?1:0};d(null,e(b.sort(c),function(a){return a.value}))})},a.auto=function(a,b){b=b||function(){};var c=g(a);if(!c.length)return b(null);var e=[];var i=[];var j=function(a){i.unshift(a)};var k=function(a){for(var b=0;b<i.length;b+=1)if(i[b]===a){i.splice(b,1);return}};var l=function(){d(i,function(a){a()})};j(function(){e.length===c.length&&b(null)}),d(c,function(c){var d=a[c]instanceof Function?[a[c]]:a[c];var g=function(a){a?(b(a),b=function(){}):(e.push(c),l())};var i=d.slice(0,Math.abs(d.length-1))||[];var m=function(){return f(i,function(a,b){return a&&h(e,b)!==-1},true)};if(m())d[d.length-1](g);else{var n=function(){m()&&(k(n),d[d.length-1](g))};j(n)}})},a.waterfall=function(b,c){if(!b.length)return c();c=c||function(){};var d=function(b){return function(e){if(e)c(e),c=function(){};else{var f=Array.prototype.slice.call(arguments,1);var g=b.next();g?f.push(d(g)):f.push(c),a.nextTick(function(){b.apply(null,f)})}}};d(a.iterator(b))()},a.parallel=function(b,c){c=c||function(){};if(b.constructor===Array)a.map(b,function(a,b){a&&a(function(a){var c=Array.prototype.slice.call(arguments,1);c.length<=1&&(c=c[0]),b.call(null,a,c)})},c);else{var d={};a.forEach(g(b),function(a,c){b[a](function(b){var e=Array.prototype.slice.call(arguments,1);e.length<=1&&(e=e[0]),d[a]=e,c(b)})},function(a){c(a,d)})}},a.series=function(b,c){c=c||function(){};if(b.constructor===Array)a.mapSeries(b,function(a,b){a&&a(function(a){var c=Array.prototype.slice.call(arguments,1);c.length<=1&&(c=c[0]),b.call(null,a,c)})},c);else{var d={};a.forEachSeries(g(b),function(a,c){b[a](function(b){var e=Array.prototype.slice.call(arguments,1);e.length<=1&&(e=e[0]),d[a]=e,c(b)})},function(a){c(a,d)})}},a.iterator=function(a){var b=function(c){var d=function(){a.length&&a[c].apply(null,arguments);return d.next()};d.next=function(){return c<a.length-1?b(c+1):null};return d};return b(0)},a.apply=function(a){var b=Array.prototype.slice.call(arguments,1);return function(){return a.apply(null,b.concat(Array.prototype.slice.call(arguments)))}};var o=function(a,b,c,d){var e=[];a(b,function(a,b){c(a,function(a,c){e=e.concat(c||[]),b(a)})},function(a){d(a,e)})};a.concat=i(o),a.concatSeries=j(o),a.whilst=function(b,c,d){b()?c(function(e){if(e)return d(e);a.whilst(b,c,d)}):d()},a.until=function(b,c,d){b()?d():c(function(e){if(e)return d(e);a.until(b,c,d)})},a.queue=function(b,c){var d=0;var e=[];var f={concurrency:c,saturated:null,empty:null,drain:null,push:function(b,d){e.push({data:b,callback:d}),f.saturated&&e.length==c&&f.saturated(),a.nextTick(f.process)},process:function(){if(d<f.concurrency&&e.length){var a=e.splice(0,1)[0];f.empty&&e.length==0&&f.empty(),d+=1,b(a.data,function(){d-=1,a.callback&&a.callback.apply(a,arguments),f.drain&&e.length+d==0&&f.drain(),f.process()})}},length:function(){return e.length},running:function(){return d}};return f};var p=function(a){return function(b){var c=Array.prototype.slice.call(arguments,1);b.apply(null,c.concat([function(b){var c=Array.prototype.slice.call(arguments,1);typeof console!=="undefined"&&(b?console.error&&console.error(b):console[a]&&d(c,function(b){console[a](b)}))}]))}};a.log=p("log"),a.dir=p("dir"),a.memoize=function(a,b){var c={};b=b||function(a){return a};return function(){var d=Array.prototype.slice.call(arguments);var e=d.pop();var f=b.apply(null,d);f in c?e.apply(null,c[f]):a.apply(null,d.concat([function(){c[f]=arguments,e.apply(null,arguments)}]))}}})();
/*!
 * jQuery JavaScript Library v1.6
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2011, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Mon May 2 13:50:00 2011 -0400
 */
(function(a,b){function cw(a){return f.isWindow(a)?a:a.nodeType===9?a.defaultView||a.parentWindow:!1}function ct(a){if(!ch[a]){var b=f("<"+a+">").appendTo("body"),d=b.css("display");b.remove();if(d==="none"||d===""){ci||(ci=c.createElement("iframe"),ci.frameBorder=ci.width=ci.height=0),c.body.appendChild(ci);if(!cj||!ci.createElement)cj=(ci.contentWindow||ci.contentDocument).document,cj.write("<!doctype><html><body></body></html>");b=cj.createElement(a),cj.body.appendChild(b),d=f.css(b,"display"),c.body.removeChild(ci)}ch[a]=d}return ch[a]}function cs(a,b){var c={};f.each(cn.concat.apply([],cn.slice(0,b)),function(){c[this]=a});return c}function cr(){co=b}function cq(){setTimeout(cr,0);return co=f.now()}function cg(){try{return new a.ActiveXObject("Microsoft.XMLHTTP")}catch(b){}}function cf(){try{return new a.XMLHttpRequest}catch(b){}}function b_(a,c){a.dataFilter&&(c=a.dataFilter(c,a.dataType));var d=a.dataTypes,e={},g,h,i=d.length,j,k=d[0],l,m,n,o,p;for(g=1;g<i;g++){if(g===1)for(h in a.converters)typeof h=="string"&&(e[h.toLowerCase()]=a.converters[h]);l=k,k=d[g];if(k==="*")k=l;else if(l!=="*"&&l!==k){m=l+" "+k,n=e[m]||e["* "+k];if(!n){p=b;for(o in e){j=o.split(" ");if(j[0]===l||j[0]==="*"){p=e[j[1]+" "+k];if(p){o=e[o],o===!0?n=p:p===!0&&(n=o);break}}}}!n&&!p&&f.error("No conversion from "+m.replace(" "," to ")),n!==!0&&(c=n?n(c):p(o(c)))}}return c}function b$(a,c,d){var e=a.contents,f=a.dataTypes,g=a.responseFields,h,i,j,k;for(i in g)i in d&&(c[g[i]]=d[i]);while(f[0]==="*")f.shift(),h===b&&(h=a.mimeType||c.getResponseHeader("content-type"));if(h)for(i in e)if(e[i]&&e[i].test(h)){f.unshift(i);break}if(f[0]in d)j=f[0];else{for(i in d){if(!f[0]||a.converters[i+" "+f[0]]){j=i;break}k||(k=i)}j=j||k}if(j){j!==f[0]&&f.unshift(j);return d[j]}}function bZ(a,b,c,d){if(f.isArray(b))f.each(b,function(b,e){c||bD.test(a)?d(a,e):bZ(a+"["+(typeof e=="object"||f.isArray(e)?b:"")+"]",e,c,d)});else if(!c&&b!=null&&typeof b=="object")for(var e in b)bZ(a+"["+e+"]",b[e],c,d);else d(a,b)}function bY(a,c,d,e,f,g){f=f||c.dataTypes[0],g=g||{},g[f]=!0;var h=a[f],i=0,j=h?h.length:0,k=a===bS,l;for(;i<j&&(k||!l);i++)l=h[i](c,d,e),typeof l=="string"&&(!k||g[l]?l=b:(c.dataTypes.unshift(l),l=bY(a,c,d,e,l,g)));(k||!l)&&!g["*"]&&(l=bY(a,c,d,e,"*",g));return l}function bX(a){return function(b,c){typeof b!="string"&&(c=b,b="*");if(f.isFunction(c)){var d=b.toLowerCase().split(bO),e=0,g=d.length,h,i,j;for(;e<g;e++)h=d[e],j=/^\+/.test(h),j&&(h=h.substr(1)||"*"),i=a[h]=a[h]||[],i[j?"unshift":"push"](c)}}}function bB(a,b,c){var d=b==="width"?bv:bw,e=b==="width"?a.offsetWidth:a.offsetHeight;if(c==="border")return e;f.each(d,function(){c||(e-=parseFloat(f.css(a,"padding"+this))||0),c==="margin"?e+=parseFloat(f.css(a,"margin"+this))||0:e-=parseFloat(f.css(a,"border"+this+"Width"))||0});return e}function bl(a,b){b.src?f.ajax({url:b.src,async:!1,dataType:"script"}):f.globalEval(b.text||b.textContent||b.innerHTML||""),b.parentNode&&b.parentNode.removeChild(b)}function bk(a){f.nodeName(a,"input")?bj(a):a.getElementsByTagName&&f.grep(a.getElementsByTagName("input"),bj)}function bj(a){if(a.type==="checkbox"||a.type==="radio")a.defaultChecked=a.checked}function bi(a){return"getElementsByTagName"in a?a.getElementsByTagName("*"):"querySelectorAll"in a?a.querySelectorAll("*"):[]}function bh(a,b){var c;if(b.nodeType===1){b.clearAttributes&&b.clearAttributes(),b.mergeAttributes&&b.mergeAttributes(a),c=b.nodeName.toLowerCase();if(c==="object")b.outerHTML=a.outerHTML;else if(c!=="input"||a.type!=="checkbox"&&a.type!=="radio"){if(c==="option")b.selected=a.defaultSelected;else if(c==="input"||c==="textarea")b.defaultValue=a.defaultValue}else a.checked&&(b.defaultChecked=b.checked=a.checked),b.value!==a.value&&(b.value=a.value);b.removeAttribute(f.expando)}}function bg(a,b){if(b.nodeType===1&&!!f.hasData(a)){var c=f.expando,d=f.data(a),e=f.data(b,d);if(d=d[c]){var g=d.events;e=e[c]=f.extend({},d);if(g){delete e.handle,e.events={};for(var h in g)for(var i=0,j=g[h].length;i<j;i++)f.event.add(b,h+(g[h][i].namespace?".":"")+g[h][i].namespace,g[h][i],g[h][i].data)}}}}function bf(a,b){return f.nodeName(a,"table")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}function W(a,b,c){b=b||0;if(f.isFunction(b))return f.grep(a,function(a,d){var e=!!b.call(a,d,a);return e===c});if(b.nodeType)return f.grep(a,function(a,d){return a===b===c});if(typeof b=="string"){var d=f.grep(a,function(a){return a.nodeType===1});if(R.test(b))return f.filter(b,d,!c);b=f.filter(b,d)}return f.grep(a,function(a,d){return f.inArray(a,b)>=0===c})}function V(a){return!a||!a.parentNode||a.parentNode.nodeType===11}function N(a,b){return(a&&a!=="*"?a+".":"")+b.replace(z,"`").replace(A,"&")}function M(a){var b,c,d,e,g,h,i,j,k,l,m,n,o,p=[],q=[],r=f._data(this,"events");if(!(a.liveFired===this||!r||!r.live||a.target.disabled||a.button&&a.type==="click")){a.namespace&&(n=new RegExp("(^|\\.)"+a.namespace.split(".").join("\\.(?:.*\\.)?")+"(\\.|$)")),a.liveFired=this;var s=r.live.slice(0);for(i=0;i<s.length;i++)g=s[i],g.origType.replace(x,"")===a.type?q.push(g.selector):s.splice(i--,1);e=f(a.target).closest(q,a.currentTarget);for(j=0,k=e.length;j<k;j++){m=e[j];for(i=0;i<s.length;i++){g=s[i];if(m.selector===g.selector&&(!n||n.test(g.namespace))&&!m.elem.disabled){h=m.elem,d=null;if(g.preType==="mouseenter"||g.preType==="mouseleave")a.type=g.preType,d=f(a.relatedTarget).closest(g.selector)[0],d&&f.contains(h,d)&&(d=h);(!d||d!==h)&&p.push({elem:h,handleObj:g,level:m.level})}}}for(j=0,k=p.length;j<k;j++){e=p[j];if(c&&e.level>c)break;a.currentTarget=e.elem,a.data=e.handleObj.data,a.handleObj=e.handleObj,o=e.handleObj.origHandler.apply(e.elem,arguments);if(o===!1||a.isPropagationStopped()){c=e.level,o===!1&&(b=!1);if(a.isImmediatePropagationStopped())break}}return b}}function K(a,c,d){var e=f.extend({},d[0]);e.type=a,e.originalEvent={},e.liveFired=b,f.event.handle.call(c,e),e.isDefaultPrevented()&&d[0].preventDefault()}function E(){return!0}function D(){return!1}function m(a,c,d){var e=c+"defer",g=c+"queue",h=c+"mark",i=f.data(a,e,b,!0);i&&(d==="queue"||!f.data(a,g,b,!0))&&(d==="mark"||!f.data(a,h,b,!0))&&setTimeout(function(){!f.data(a,g,b,!0)&&!f.data(a,h,b,!0)&&(f.removeData(a,e,!0),i.resolve())},0)}function l(a){for(var b in a)if(b!=="toJSON")return!1;return!0}function k(a,c,d){if(d===b&&a.nodeType===1){name="data-"+c.replace(j,"$1-$2").toLowerCase(),d=a.getAttribute(name);if(typeof d=="string"){try{d=d==="true"?!0:d==="false"?!1:d==="null"?null:f.isNaN(d)?i.test(d)?f.parseJSON(d):d:parseFloat(d)}catch(e){}f.data(a,c,d)}else d=b}return d}var c=a.document,d=a.navigator,e=a.location,f=function(){function H(){if(!e.isReady){try{c.documentElement.doScroll("left")}catch(a){setTimeout(H,1);return}e.ready()}}var e=function(a,b){return new e.fn.init(a,b,h)},f=a.jQuery,g=a.$,h,i=/^(?:[^<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,j=/\S/,k=/^\s+/,l=/\s+$/,m=/\d/,n=/^<(\w+)\s*\/?>(?:<\/\1>)?$/,o=/^[\],:{}\s]*$/,p=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,q=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,r=/(?:^|:|,)(?:\s*\[)+/g,s=/(webkit)[ \/]([\w.]+)/,t=/(opera)(?:.*version)?[ \/]([\w.]+)/,u=/(msie) ([\w.]+)/,v=/(mozilla)(?:.*? rv:([\w.]+))?/,w=d.userAgent,x,y,z,A=Object.prototype.toString,B=Object.prototype.hasOwnProperty,C=Array.prototype.push,D=Array.prototype.slice,E=String.prototype.trim,F=Array.prototype.indexOf,G={};e.fn=e.prototype={constructor:e,init:function(a,d,f){var g,h,j,k;if(!a)return this;if(a.nodeType){this.context=this[0]=a,this.length=1;return this}if(a==="body"&&!d&&c.body){this.context=c,this[0]=c.body,this.selector=a,this.length=1;return this}if(typeof a=="string"){a.charAt(0)==="<"&&a.charAt(a.length-1)===">"&&a.length>=3?g=[null,a,null]:g=i.exec(a);if(g&&(g[1]||!d)){if(g[1]){d=d instanceof e?d[0]:d,k=d?d.ownerDocument||d:c,j=n.exec(a),j?e.isPlainObject(d)?(a=[c.createElement(j[1])],e.fn.attr.call(a,d,!0)):a=[k.createElement(j[1])]:(j=e.buildFragment([g[1]],[k]),a=(j.cacheable?e.clone(j.fragment):j.fragment).childNodes);return e.merge(this,a)}h=c.getElementById(g[2]);if(h&&h.parentNode){if(h.id!==g[2])return f.find(a);this.length=1,this[0]=h}this.context=c,this.selector=a;return this}return!d||d.jquery?(d||f).find(a):this.constructor(d).find(a)}if(e.isFunction(a))return f.ready(a);a.selector!==b&&(this.selector=a.selector,this.context=a.context);return e.makeArray(a,this)},selector:"",jquery:"1.6",length:0,size:function(){return this.length},toArray:function(){return D.call(this,0)},get:function(a){return a==null?this.toArray():a<0?this[this.length+a]:this[a]},pushStack:function(a,b,c){var d=this.constructor();e.isArray(a)?C.apply(d,a):e.merge(d,a),d.prevObject=this,d.context=this.context,b==="find"?d.selector=this.selector+(this.selector?" ":"")+c:b&&(d.selector=this.selector+"."+b+"("+c+")");return d},each:function(a,b){return e.each(this,a,b)},ready:function(a){e.bindReady(),y.done(a);return this},eq:function(a){return a===-1?this.slice(a):this.slice(a,+a+1)},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},slice:function(){return this.pushStack(D.apply(this,arguments),"slice",D.call(arguments).join(","))},map:function(a){return this.pushStack(e.map(this,function(b,c){return a.call(b,c,b)}))},end:function(){return this.prevObject||this.constructor(null)},push:C,sort:[].sort,splice:[].splice},e.fn.init.prototype=e.fn,e.extend=e.fn.extend=function(){var a,c,d,f,g,h,i=arguments[0]||{},j=1,k=arguments.length,l=!1;typeof i=="boolean"&&(l=i,i=arguments[1]||{},j=2),typeof i!="object"&&!e.isFunction(i)&&(i={}),k===j&&(i=this,--j);for(;j<k;j++)if((a=arguments[j])!=null)for(c in a){d=i[c],f=a[c];if(i===f)continue;l&&f&&(e.isPlainObject(f)||(g=e.isArray(f)))?(g?(g=!1,h=d&&e.isArray(d)?d:[]):h=d&&e.isPlainObject(d)?d:{},i[c]=e.extend(l,h,f)):f!==b&&(i[c]=f)}return i},e.extend({noConflict:function(b){a.$===e&&(a.$=g),b&&a.jQuery===e&&(a.jQuery=f);return e},isReady:!1,readyWait:1,holdReady:function(a){a?e.readyWait++:e.ready(!0)},ready:function(a){if(a===!0&&!--e.readyWait||a!==!0&&!e.isReady){if(!c.body)return setTimeout(e.ready,1);e.isReady=!0;if(a!==!0&&--e.readyWait>0)return;y.resolveWith(c,[e]),e.fn.trigger&&e(c).trigger("ready").unbind("ready")}},bindReady:function(){if(!y){y=e._Deferred();if(c.readyState==="complete")return setTimeout(e.ready,1);if(c.addEventListener)c.addEventListener("DOMContentLoaded",z,!1),a.addEventListener("load",e.ready,!1);else if(c.attachEvent){c.attachEvent("onreadystatechange",z),a.attachEvent("onload",e.ready);var b=!1;try{b=a.frameElement==null}catch(d){}c.documentElement.doScroll&&b&&H()}}},isFunction:function(a){return e.type(a)==="function"},isArray:Array.isArray||function(a){return e.type(a)==="array"},isWindow:function(a){return a&&typeof a=="object"&&"setInterval"in a},isNaN:function(a){return a==null||!m.test(a)||isNaN(a)},type:function(a){return a==null?String(a):G[A.call(a)]||"object"},isPlainObject:function(a){if(!a||e.type(a)!=="object"||a.nodeType||e.isWindow(a))return!1;if(a.constructor&&!B.call(a,"constructor")&&!B.call(a.constructor.prototype,"isPrototypeOf"))return!1;var c;for(c in a);return c===b||B.call(a,c)},isEmptyObject:function(a){for(var b in a)return!1;return!0},error:function(a){throw a},parseJSON:function(b){if(typeof b!="string"||!b)return null;b=e.trim(b);if(a.JSON&&a.JSON.parse)return a.JSON.parse(b);if(o.test(b.replace(p,"@").replace(q,"]").replace(r,"")))return(new Function("return "+b))();e.error("Invalid JSON: "+b)},parseXML:function(b,c,d){a.DOMParser?(d=new DOMParser,c=d.parseFromString(b,"text/xml")):(c=new ActiveXObject("Microsoft.XMLDOM"),c.async="false",c.loadXML(b)),d=c.documentElement,(!d||!d.nodeName||d.nodeName==="parsererror")&&e.error("Invalid XML: "+b);return c},noop:function(){},globalEval:function(b){b&&j.test(b)&&(a.execScript||function(b){a.eval.call(a,b)})(b)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toUpperCase()===b.toUpperCase()},each:function(a,c,d){var f,g=0,h=a.length,i=h===b||e.isFunction(a);if(d){if(i){for(f in a)if(c.apply(a[f],d)===!1)break}else for(;g<h;)if(c.apply(a[g++],d)===!1)break}else if(i){for(f in a)if(c.call(a[f],f,a[f])===!1)break}else for(;g<h;)if(c.call(a[g],g,a[g++])===!1)break;return a},trim:E?function(a){return a==null?"":E.call(a)}:function(a){return a==null?"":(a+"").replace(k,"").replace(l,"")},makeArray:function(a,b){var c=b||[];if(a!=null){var d=e.type(a);a.length==null||d==="string"||d==="function"||d==="regexp"||e.isWindow(a)?C.call(c,a):e.merge(c,a)}return c},inArray:function(a,b){if(F)return F.call(b,a);for(var c=0,d=b.length;c<d;c++)if(b[c]===a)return c;return-1},merge:function(a,c){var d=a.length,e=0;if(typeof c.length=="number")for(var f=c.length;e<f;e++)a[d++]=c[e];else while(c[e]!==b)a[d++]=c[e++];a.length=d;return a},grep:function(a,b,c){var d=[],e;c=!!c;for(var f=0,g=a.length;f<g;f++)e=!!b(a[f],f),c!==e&&d.push(a[f]);return d},map:function(a,c,d){var f,g,h=[],i=0,j=a.length,k=a instanceof e||j!==b&&typeof j=="number"&&(j>0&&a[0]&&a[j-1]||j===0||e.isArray(a));if(k)for(;i<j;i++)f=c(a[i],i,d),f!=null&&(h[h.length]=f);else for(g in a)f=c(a[g],g,d),f!=null&&(h[h.length]=f);return h.concat.apply([],h)},guid:1,proxy:function(a,c){if(typeof c=="string"){var d=a[c];c=a,a=d}if(!e.isFunction(a))return b;var f=D.call(arguments,2),g=function(){return a.apply(c,f.concat(D.call(arguments)))};g.guid=a.guid=a.guid||g.guid||e.guid++;return g},access:function(a,c,d,f,g,h){var i=a.length;if(typeof c=="object"){for(var j in c)e.access(a,j,c[j],f,g,d);return a}if(d!==b){f=!h&&f&&e.isFunction(d);for(var k=0;k<i;k++)g(a[k],c,f?d.call(a[k],k,g(a[k],c)):d,h);return a}return i?g(a[0],c):b},now:function(){return(new Date).getTime()},uaMatch:function(a){a=a.toLowerCase();var b=s.exec(a)||t.exec(a)||u.exec(a)||a.indexOf("compatible")<0&&v.exec(a)||[];return{browser:b[1]||"",version:b[2]||"0"}},sub:function(){function a(b,c){return new a.fn.init(b,c)}e.extend(!0,a,this),a.superclass=this,a.fn=a.prototype=this(),a.fn.constructor=a,a.sub=this.sub,a.fn.init=function(c,d){d&&d instanceof e&&!(d instanceof a)&&(d=a(d));return e.fn.init.call(this,c,d,b)},a.fn.init.prototype=a.fn;var b=a(c);return a},browser:{}}),e.each("Boolean Number String Function Array Date RegExp Object".split(" "),function(a,b){G["[object "+b+"]"]=b.toLowerCase()}),x=e.uaMatch(w),x.browser&&(e.browser[x.browser]=!0,e.browser.version=x.version),e.browser.webkit&&(e.browser.safari=!0),j.test(" ")&&(k=/^[\s\xA0]+/,l=/[\s\xA0]+$/),h=e(c),c.addEventListener?z=function(){c.removeEventListener("DOMContentLoaded",z,!1),e.ready()}:c.attachEvent&&(z=function(){c.readyState==="complete"&&(c.detachEvent("onreadystatechange",z),e.ready())});return e}(),g="done fail isResolved isRejected promise then always pipe".split(" "),h=[].slice;f.extend({_Deferred:function(){var a=[],b,c,d,e={done:function(){if(!d){var c=arguments,g,h,i,j,k;b&&(k=b,b=0);for(g=0,h=c.length;g<h;g++)i=c[g],j=f.type(i),j==="array"?e.done.apply(e,i):j==="function"&&a.push(i);k&&e.resolveWith(k[0],k[1])}return this},resolveWith:function(e,f){if(!d&&!b&&!c){f=f||[],c=1;try{while(a[0])a.shift().apply(e,f)}finally{b=[e,f],c=0}}return this},resolve:function(){e.resolveWith(this,arguments);return this},isResolved:function(){return!!c||!!b},cancel:function(){d=1,a=[];return this}};return e},Deferred:function(a){var b=f._Deferred(),c=f._Deferred(),d;f.extend(b,{then:function(a,c){b.done(a).fail(c);return this},always:function(){return b.done.apply(b,arguments).fail.apply(this,arguments)},fail:c.done,rejectWith:c.resolveWith,reject:c.resolve,isRejected:c.isResolved,pipe:function(a,c){return f.Deferred(function(d){f.each({done:[a,"resolve"],fail:[c,"reject"]},function(a,c){var e=c[0],g=c[1],h;f.isFunction(e)?b[a](function(){h=e.apply(this,arguments),f.isFunction(h.promise)?h.promise().then(d.resolve,d.reject):d[g](h)}):b[a](d[g])})}).promise()},promise:function(a){if(a==null){if(d)return d;d=a={}}var c=g.length;while(c--)a[g[c]]=b[g[c]];return a}}),b.done(c.cancel).fail(b.cancel),delete b.cancel,a&&a.call(b,b);return b},when:function(a){function i(a){return function(c){b[a]=arguments.length>1?h.call(arguments,0):c,--e||g.resolveWith(g,h.call(b,0))}}var b=arguments,c=0,d=b.length,e=d,g=d<=1&&a&&f.isFunction(a.promise)?a:f.Deferred();if(d>1){for(;c<d;c++)b[c]&&f.isFunction(b[c].promise)?b[c].promise().then(i(c),g.reject):--e;e||g.resolveWith(g,b)}else g!==a&&g.resolveWith(g,d?[a]:[]);return g.promise()}}),f.support=function(){var a=c.createElement("div"),b,d,e,f,g,h,i,j,k,l,m,n,o,p,q;a.setAttribute("className","t"),a.innerHTML="   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>",b=a.getElementsByTagName("*"),d=a.getElementsByTagName("a")[0];if(!b||!b.length||!d)return{};e=c.createElement("select"),f=e.appendChild(c.createElement("option")),g=a.getElementsByTagName("input")[0],i={leadingWhitespace:a.firstChild.nodeType===3,tbody:!a.getElementsByTagName("tbody").length,htmlSerialize:!!a.getElementsByTagName("link").length,style:/top/.test(d.getAttribute("style")),hrefNormalized:d.getAttribute("href")==="/a",opacity:/^0.55$/.test(d.style.opacity),cssFloat:!!d.style.cssFloat,checkOn:g.value==="on",optSelected:f.selected,getSetAttribute:a.className!=="t",submitBubbles:!0,changeBubbles:!0,focusinBubbles:!1,deleteExpando:!0,noCloneEvent:!0,inlineBlockNeedsLayout:!1,shrinkWrapBlocks:!1,reliableMarginRight:!0},g.checked=!0,i.noCloneChecked=g.cloneNode(!0).checked,e.disabled=!0,i.optDisabled=!f.disabled;try{delete a.test}catch(r){i.deleteExpando=!1}!a.addEventListener&&a.attachEvent&&a.fireEvent&&(a.attachEvent("onclick",function click(){i.noCloneEvent=!1,a.detachEvent("onclick",click)}),a.cloneNode(!0).fireEvent("onclick")),g=c.createElement("input"),g.value="t",g.setAttribute("type","radio"),i.radioValue=g.value==="t",g.setAttribute("checked","checked"),a.appendChild(g),j=c.createDocumentFragment(),j.appendChild(a.firstChild),i.checkClone=j.cloneNode(!0).cloneNode(!0).lastChild.checked,a.innerHTML="",a.style.width=a.style.paddingLeft="1px",k=c.createElement("body"),l={visibility:"hidden",width:0,height:0,border:0,margin:0,background:"none"};for(p in l)k.style[p]=l[p];k.appendChild(a),c.documentElement.appendChild(k),i.appendChecked=g.checked,i.boxModel=a.offsetWidth===2,"zoom"in a.style&&(a.style.display="inline",a.style.zoom=1,i.inlineBlockNeedsLayout=a.offsetWidth===2,a.style.display="",a.innerHTML="<div style='width:4px;'></div>",i.shrinkWrapBlocks=a.offsetWidth!==2),a.innerHTML="<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>",m=a.getElementsByTagName("td"),q=m[0].offsetHeight===0,m[0].style.display="",m[1].style.display="none",i.reliableHiddenOffsets=q&&m[0].offsetHeight===0,a.innerHTML="",c.defaultView&&c.defaultView.getComputedStyle&&(h=c.createElement("div"),h.style.width="0",h.style.marginRight="0",a.appendChild(h),i.reliableMarginRight=(parseInt(c.defaultView.getComputedStyle(h,null).marginRight,10)||0)===0),k.innerHTML="",c.documentElement.removeChild(k);if(a.attachEvent)for(p in{submit:1,change:1,focusin:1})o="on"+p,q=o in a,q||(a.setAttribute(o,"return;"),q=typeof a[o]=="function"),i[p+"Bubbles"]=q;return i}(),f.boxModel=f.support.boxModel;var i=/^(?:\{.*\}|\[.*\])$/,j=/([a-z])([A-Z])/g;f.extend({cache:{},uuid:0,expando:"jQuery"+(f.fn.jquery+Math.random()).replace(/\D/g,""),noData:{embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:!0},hasData:function(a){a=a.nodeType?f.cache[a[f.expando]]:a[f.expando];return!!a&&!l(a)},data:function(a,c,d,e){if(!!f.acceptData(a)){var g=f.expando,h=typeof c=="string",i,j=a.nodeType,k=j?f.cache:a,l=j?a[f.expando]:a[f.expando]&&f.expando;if((!l||e&&l&&!k[l][g])&&h&&d===b)return;l||(j?a[f.expando]=l=++f.uuid:l=f.expando),k[l]||(k[l]={},j||(k[l].toJSON=f.noop));if(typeof c=="object"||typeof c=="function")e?k[l][g]=f.extend(k[l][g],c):k[l]=f.extend(k[l],c);i=k[l],e&&(i[g]||(i[g]={}),i=i[g]),d!==b&&(i[c]=d);if(c==="events"&&!i[c])return i[g]&&i[g].events;return h?i[c]:i}},removeData:function(b,c,d){if(!!f.acceptData(b)){var e=f.expando,g=b.nodeType,h=g?f.cache:b,i=g?b[f.expando]:f.expando;if(!h[i])return;if(c){var j=d?h[i][e]:h[i];if(j){delete j[c];if(!l(j))return}}if(d){delete h[i][e];if(!l(h[i]))return}var k=h[i][e];f.support.deleteExpando||h!=a?delete h[i]:h[i]=null,k?(h[i]={},g||(h[i].toJSON=f.noop),h[i][e]=k):g&&(f.support.deleteExpando?delete b[f.expando]:b.removeAttribute?b.removeAttribute(f.expando):b[f.expando]=null)}},_data:function(a,b,c){return f.data(a,b,c,!0)},acceptData:function(a){if(a.nodeName){var b=f.noData[a.nodeName.toLowerCase()];if(b)return b!==!0&&a.getAttribute("classid")===b}return!0}}),f.fn.extend({data:function(a,c){var d=null;if(typeof a=="undefined"){if(this.length){d=f.data(this[0]);if(this[0].nodeType===1){var e=this[0].attributes,g;for(var h=0,i=e.length;h<i;h++)g=e[h].name,g.indexOf("data-")===0&&(g=f.camelCase(g.substring(5)),k(this[0],g,d[g]))}}return d}if(typeof a=="object")return this.each(function(){f.data(this,a)});var j=a.split(".");j[1]=j[1]?"."+j[1]:"";if(c===b){d=this.triggerHandler("getData"+j[1]+"!",[j[0]]),d===b&&this.length&&(d=f.data(this[0],a),d=k(this[0],a,d));return d===b&&j[1]?this.data(j[0]):d}return this.each(function(){var b=f(this),d=[j[0],c];b.triggerHandler("setData"+j[1]+"!",d),f.data(this,a,c),b.triggerHandler("changeData"+j[1]+"!",d)})},removeData:function(a){return this.each(function(){f.removeData(this,a)})}}),f.extend({_mark:function(a,c){a&&(c=(c||"fx")+"mark",f.data(a,c,(f.data(a,c,b,!0)||0)+1,!0))},_unmark:function(a,c,d){a!==!0&&(d=c,c=a,a=!1);if(c){d=d||"fx";var e=d+"mark",g=a?0:(f.data(c,e,b,!0)||1)-1;g?f.data(c,e,g,!0):(f.removeData(c,e,!0),m(c,d,"mark"))}},queue:function(a,c,d){if(a){c=(c||"fx")+"queue";var e=f.data(a,c,b,!0);d&&(!e||f.isArray(d)?e=f.data(a,c,f.makeArray(d),!0):e.push(d));return e||[]}},dequeue:function(a,b){b=b||"fx";var c=f.queue(a,b),d=c.shift(),e;d==="inprogress"&&(d=c.shift()),d&&(b==="fx"&&c.unshift("inprogress"),d.call(a,function(){f.dequeue(a,b)})),c.length||(f.removeData(a,b+"queue",!0),m(a,b,"queue"))}}),f.fn.extend({queue:function(a,c){typeof a!="string"&&(c=a,a="fx");if(c===b)return f.queue(this[0],a);return this.each(function(){var b=f.queue(this,a,c);a==="fx"&&b[0]!=="inprogress"&&f.dequeue(this,a)})},dequeue:function(a){return this.each(function(){f.dequeue(this,a)})},delay:function(a,b){a=f.fx?f.fx.speeds[a]||a:a,b=b||"fx";return this.queue(b,function(){var c=this;setTimeout(function(){f.dequeue(c,b)},a)})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,c){function l(){--h||d.resolveWith(e,[e])}typeof a!="string"&&(c=a,a=b),a=a||"fx";var d=f.Deferred(),e=this,g=e.length,h=1,i=a+"defer",j=a+"queue",k=a+"mark";while(g--)if(tmp=f.data(e[g],i,b,!0)||(f.data(e[g],j,b,!0)||f.data(e[g],k,b,!0))&&f.data(e[g],i,f._Deferred(),!0))h++,tmp.done(l);l();return d.promise()}});var n=/[\n\t\r]/g,o=/\s+/,p=/\r/g,q=/^(?:button|input)$/i,r=/^(?:button|input|object|select|textarea)$/i,s=/^a(?:rea)?$/i,t=/^(?:data-|aria-)/,u=/\:/,v;f.fn.extend({attr:function(a,b){return f.access(this,a,b,!0,f.attr)},removeAttr:function(a){return this.each(function(){f.removeAttr(this,a)})},prop:function(a,b){return f.access(this,a,b,!0,f.prop)},removeProp:function(a){return this.each(function(){try{this[a]=b,delete this[a]}catch(c){}})},addClass:function(a){if(f.isFunction(a))return this.each(function(b){var c=f(this);c.addClass(a.call(this,b,c.attr("class")||""))});if(a&&typeof a=="string"){var b=(a||"").split(o);for(var c=0,d=this.length;c<d;c++){var e=this[c];if(e.nodeType===1)if(!e.className)e.className=a;else{var g=" "+e.className+" ",h=e.className;for(var i=0,j=b.length;i<j;i++)g.indexOf(" "+b[i]+" ")<0&&(h+=" "+b[i]);e.className=f.trim(h)}}}return this},removeClass:function(a){if(f.isFunction(a))return this.each(function(b){var c=f(this);c.removeClass(a.call(this,b,c.attr("class")))});if(a&&typeof a=="string"||a===b){var c=(a||"").split(o);for(var d=0,e=this.length;d<e;d++){var g=this[d];if(g.nodeType===1&&g.className)if(a){var h=(" "+g.className+" ").replace(n," ");for(var i=0,j=c.length;i<j;i++)h=h.replace(" "+c[i]+" "," ");g.className=f.trim(h)}else g.className=""}}return this},toggleClass:function(a,b){var c=typeof a,d=typeof b=="boolean";if(f.isFunction(a))return this.each(function(c){var d=f(this);d.toggleClass(a.call(this,c,d.attr("class"),b),b)});return this.each(function(){if(c==="string"){var e,g=0,h=f(this),i=b,j=a.split(o);while(e=j[g++])i=d?i:!h.hasClass(e),h[i?"addClass":"removeClass"](e)}else if(c==="undefined"||c==="boolean")this.className&&f._data(this,"__className__",this.className),this.className=this.className||a===!1?"":f._data(this,"__className__")||""})},hasClass:function(a){var b=" "+a+" ";for(var c=0,d=this.length;c<d;c++)if((" "+this[c].className+" ").replace(n," ").indexOf(b)>-1)return!0;return!1},val:function(a){var c,d,e=this[0];if(!arguments.length){if(e){c=f.valHooks[e.nodeName.toLowerCase()]||f.valHooks[e.type];if(c&&"get"in c&&(d=c.get(e,"value"))!==b)return d;return(e.value||"").replace(p,"")}return b}var g=f.isFunction(a);return this.each(function(d){var e=f(this),h;if(this.nodeType===1){g?h=a.call(this,d,e.val()):h=a,h==null?h="":typeof h=="number"?h+="":f.isArray(h)&&(h=f.map(h,function(a){return a==null?"":a+""})),c=f.valHooks[this.nodeName.toLowerCase()]||f.valHooks[this.type];if(!c||"set"in c&&c.set(this,h,"value")===b)this.value=h}})}}),f.extend({valHooks:{option:{get:function(a){var b=a.attributes.value;return!b||b.specified?a.value:a.text}},select:{get:function(a){var b=a.selectedIndex,c=[],d=a.options,e=a.type==="select-one";if(b<0)return null;for(var g=e?b:0,h=e?b+1:d.length;g<h;g++){var i=d[g];if(i.selected&&(f.support.optDisabled?!i.disabled:i.getAttribute("disabled")===null)&&(!i.parentNode.disabled||!f.nodeName(i.parentNode,"optgroup"))){value=f(i).val();if(e)return value;c.push(value)}}if(e&&!c.length&&d.length)return f(d[b]).val();return c},set:function(a,b){var c=f.makeArray(b);f(a).find("option").each(function(){this.selected=f.inArray(f(this).val(),c)>=0}),c.length||(a.selectedIndex=-1);return c}}},attrFn:{val:!0,css:!0,html:!0,text:!0,data:!0,width:!0,height:!0,offset:!0},attrFix:{tabindex:"tabIndex",readonly:"readOnly"},attr:function(a,c,d,e){var g=a.nodeType;if(!a||g===3||g===8||g===2)return b;if(e&&c in f.attrFn)return f(a)[c](d);var h,i,j=g!==1||!f.isXMLDoc(a);c=j&&f.attrFix[c]||c,i=f.attrHooks[c]||(v&&(f.nodeName(a,"form")||u.test(c))?v:b);if(d!==b){if(d===null||d===!1&&!t.test(c)){f.removeAttr(a,c);return b}if(i&&"set"in i&&j&&(h=i.set(a,d,c))!==b)return h;d===!0&&!t.test(c)&&(d=c),a.setAttribute(c,""+d);return d}if(i&&"get"in i&&j)return i.get(a,c);h=a.getAttribute(c);return h===null?b:h},removeAttr:function(a,b){a.nodeType===1&&(b=f.attrFix[b]||b,f.support.getSetAttribute?a.removeAttribute(b):(f.attr(a,b,""),a.removeAttributeNode(a.getAttributeNode(b))))},attrHooks:{type:{set:function(a,b){if(q.test(a.nodeName)&&a.parentNode)f.error("type property can't be changed");else if(!f.support.radioValue&&b==="radio"&&f.nodeName(a,"input")){var c=a.getAttribute("value");a.setAttribute("type",b),c&&(a.value=c);return b}}},tabIndex:{get:function(a){var c=a.getAttributeNode("tabIndex");return c&&c.specified?parseInt(c.value,10):r.test(a.nodeName)||s.test(a.nodeName)&&a.href?0:b}}},propFix:{},prop:function(a,c,d){var e=a.nodeType;if(!a||e===3||e===8||e===2)return b;var g,h,i=e!==1||!f.isXMLDoc(a);c=i&&f.propFix[c]||c,h=f.propHooks[c];return d!==b?h&&"set"in h&&(g=h.set(a,d,c))!==b?g:a[c]=d:h&&"get"in h&&(g=h.get(a,c))!==b?g:a[c]},propHooks:{}}),f.support.getSetAttribute||(f.attrFix=f.extend(f.attrFix,{"for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder"}),v=f.attrHooks.name=f.attrHooks.value=f.valHooks.button={get:function(a,c){var d;if(c==="value"&&!f.nodeName(a,"button"))return a.getAttribute(c);d=a.getAttributeNode(c);return d&&d.specified?d.nodeValue:b},set:function(a,b,c){var d=a.getAttributeNode(c);if(d){d.nodeValue=b;return b}}},f.each(["width","height"],function(a,b){f.attrHooks[b]=f.extend(f.attrHooks[b],{set:function(a,c){if(c===""){a.setAttribute(b,"auto");return c}}})})),f.support.hrefNormalized||f.each(["href","src","width","height"],function(a,c){f.attrHooks[c]=f.extend(f.attrHooks[c],{get:function(a){var d=a.getAttribute(c,2);return d===null?b:d}})}),f.support.style||(f.attrHooks.style={get:function(a){return a.style.cssText.toLowerCase()||b},set:function(a,b){return a.style.cssText=""+b}}),f.support.optSelected||(f.propHooks.selected=f.extend(f.propHooks.selected,{get:function(a){var b=a.parentNode;b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex)}})),f.support.checkOn||f.each(["radio","checkbox"],function(){f.valHooks[this]={get:function(a){return a.getAttribute("value")===null?"on":a.value}}}),f.each(["radio","checkbox"],function(){f.valHooks[this]=f.extend(f.valHooks[this],{set:function(a,b){if(f.isArray(b))return a.checked=f.inArray(f(a).val(),b)>=0}})});var w=Object.prototype.hasOwnProperty,x=/\.(.*)$/,y=/^(?:textarea|input|select)$/i,z=/\./g,A=/ /g,B=/[^\w\s.|`]/g,C=function(a){return a.replace(B,"\\$&")};f.event={add:function(a,c,d,e){if(a.nodeType!==3&&a.nodeType!==8){if(d===!1)d=D;else if(!d)return;var g,h;d.handler&&(g=d,d=g.handler),d.guid||(d.guid=f.guid++);var i=f._data(a);if(!i)return;var j=i.events,k=i.handle;j||(i.events=j={}),k||(i.handle=k=function(a){return typeof f!="undefined"&&(!a||f.event.triggered!==a.type)?f.event.handle.apply(k.elem,arguments):b}),k.elem=a,c=c.split(" ");var l,m=0,n;while(l=c[m++]){h=g?f.extend({},g):{handler:d,data:e},l.indexOf(".")>-1?(n=l.split("."),l=n.shift(),h.namespace=n.slice(0).sort().join(".")):(n=[],h.namespace=""),h.type=l,h.guid||(h.guid=d.guid);var o=j[l],p=f.event.special[l]||{};if(!o){o=j[l]=[];if(!p.setup||p.setup.call(a,e,n,k)===!1)a.addEventListener?a.addEventListener(l,k,!1):a.attachEvent&&a.attachEvent("on"+l,k)}p.add&&(p.add.call(a,h),h.handler.guid||(h.handler.guid=d.guid)),o.push(h),f.event.global[l]=!0}a=null}},global:{},remove:function(a,c,d,e){if(a.nodeType!==3&&a.nodeType!==8){d===!1&&(d=D);var g,h,i,j,k=0,l,m,n,o,p,q,r,s=f.hasData(a)&&f._data(a),t=s&&s.events;if(!s||!t)return;c&&c.type&&(d=c.handler,c=c.type);if(!c||typeof c=="string"&&c.charAt(0)==="."){c=c||"";for(h in t)f.event.remove(a,h+c);return}c=c.split(" ");while(h=c[k++]){r=h,q=null,l=h.indexOf(".")<0,m=[],l||(m=h.split("."),h=m.shift(),n=new RegExp("(^|\\.)"+f.map(m.slice(0).sort(),C).join("\\.(?:.*\\.)?")+"(\\.|$)")),p=t[h];if(!p)continue;if(!d){for(j=0;j<p.length;j++){q=p[j];if(l||n.test(q.namespace))f.event.remove(a,r,q.handler,j),p.splice(j--,1)}continue}o=f.event.special[h]||{};for(j=e||0;j<p.length;j++){q=p[j];if(d.guid===q.guid){if(l||n.test(q.namespace))e==null&&p.splice(j--,1),o.remove&&o.remove.call(a,q);if(e!=null)break}}if(p.length===0||e!=null&&p.length===1)(!o.teardown||o.teardown.call(a,m)===!1)&&f.removeEvent(a,h,s.handle),g=null,delete t[h]}if(f.isEmptyObject(t)){var u=s.handle;u&&(u.elem=null),delete s.events,delete s.handle,f.isEmptyObject(s)&&f.removeData(a,b,!0)}}},customEvent:{getData:!0,setData:!0,changeData:!0},trigger:function(c,d,e,g){var h=c.type||c,i=[],j;h.indexOf("!")>=0&&(h=h.slice(0,-1),j=!0),h.indexOf(".")>=0&&(i=h.split("."),h=i.shift(),i.sort());if(!!e&&!f.event.customEvent[h]||!!f.event.global[h]){c=typeof c=="object"?c[f.expando]?c:new f.Event(h,c):new f.Event(h),c.type=h,c.exclusive=j,c.namespace=i.join("."),c.namespace_re=new RegExp("(^|\\.)"+i.join("\\.(?:.*\\.)?")+"(\\.|$)");if(g||!e)c.preventDefault(),c.stopPropagation();if(!e){f.each(f.cache,function(){var a=f.expando,b=this[a];b&&b.events&&b.events[h]&&f.event.trigger(c,d,b.handle.elem)});return}if(e.nodeType===3||e.nodeType===8)return;c.result=b,c.target=e,d=d?f.makeArray(d):[],d.unshift(c);var k=e,l=h.indexOf(":")<0?"on"+h:"";do{var m=f._data(k,"handle");c.currentTarget=k,m&&m.apply(k,d),l&&f.acceptData(k)&&k[l]&&k[l].apply(k,d)===!1&&(c.result=!1,c.preventDefault()),k=k.parentNode||k.ownerDocument||k===c.target.ownerDocument&&a}while(k&&!c.isPropagationStopped());if(!c.isDefaultPrevented()){var n,o=f.event.special[h]||{};if((!o._default||o._default.call(e.ownerDocument,c)===!1)&&(h!=="click"||!f.nodeName(e,"a"))&&f.acceptData(e)){try{l&&e[h]&&(n=e[l],n&&(e[l]=null),f.event.triggered=h,e[h]())}catch(p){}n&&(e[l]=n),f.event.triggered=b}}return c.result}},handle:function(c){c=f.event.fix(c||a.event);var d=((f._data(this,"events")||{})[c.type]||[]).slice(0),e=!c.exclusive&&!c.namespace,g=Array.prototype.slice.call(arguments,0);g[0]=c,c.currentTarget=this;for(var h=0,i=d.length;h<i;h++){var j=d[h];if(e||c.namespace_re.test(j.namespace)){c.handler=j.handler,c.data=j.data,c.handleObj=j;var k=j.handler.apply(this,g);k!==b&&(c.result=k,k===!1&&(c.preventDefault(),c.stopPropagation()));if(c.isImmediatePropagationStopped())break}}return c.result},props:"altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),fix:function(a){if(a[f.expando])return a;var d=a;a=f.Event(d);for(var e=this.props.length,g;e;)g=this.props[--e],a[g]=d[g];a.target||(a.target=a.srcElement||c),a.target.nodeType===3&&(a.target=a.target.parentNode),!a.relatedTarget&&a.fromElement&&(a.relatedTarget=a.fromElement===a.target?a.toElement:a.fromElement);if(a.pageX==null&&a.clientX!=null){var h=a.target.ownerDocument||c,i=h.documentElement,j=h.body;a.pageX=a.clientX+(i&&i.scrollLeft||j&&j.scrollLeft||0)-(i&&i.clientLeft||j&&j.clientLeft||0),a.pageY=a.clientY+(i&&i.scrollTop||j&&j.scrollTop||0)-(i&&i.clientTop||j&&j.clientTop||0)}a.which==null&&(a.charCode!=null||a.keyCode!=null)&&(a.which=a.charCode!=null?a.charCode:a.keyCode),!a.metaKey&&a.ctrlKey&&(a.metaKey=a.ctrlKey),!a.which&&a.button!==b&&(a.which=a.button&1?1:a.button&2?3:a.button&4?2:0);return a},guid:1e8,proxy:f.proxy,special:{ready:{setup:f.bindReady,teardown:f.noop},live:{add:function(a){f.event.add(this,N(a.origType,a.selector),f.extend({},a,{handler:M,guid:a.handler.guid}))},remove:function(a){f.event.remove(this,N(a.origType,a.selector),a)}},beforeunload:{setup:function(a,b,c){f.isWindow(this)&&(this.onbeforeunload=c)},teardown:function(a,b){this.onbeforeunload===b&&(this.onbeforeunload=null)}}}},f.removeEvent=c.removeEventListener?function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)}:function(a,b,c){a.detachEvent&&a.detachEvent("on"+b,c)},f.Event=function(a,b){if(!this.preventDefault)return new f.Event(a,b);a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||a.returnValue===!1||a.getPreventDefault&&a.getPreventDefault()?E:D):this.type=a,b&&f.extend(this,b),this.timeStamp=f.now(),this[f.expando]=!0},f.Event.prototype={preventDefault:function(){this.isDefaultPrevented=E;var a=this.originalEvent;!a||(a.preventDefault?a.preventDefault():a.returnValue=!1)},stopPropagation:function(){this.isPropagationStopped=E;var a=this.originalEvent;!a||(a.stopPropagation&&a.stopPropagation(),a.cancelBubble=!0)},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=E,this.stopPropagation()},isDefaultPrevented:D,isPropagationStopped:D,isImmediatePropagationStopped:D};var F=function(a){var b=a.relatedTarget;try{if(b&&b!==c&&!b.parentNode)return;while(b&&b!==this)b=b.parentNode;b!==this&&(a.type=a.data,f.event.handle.apply(this,arguments))}catch(d){}},G=function(a){a.type=a.data,f.event.handle.apply(this,arguments)};f.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(a,b){f.event.special[a]={setup:function(c){f.event.add(this,b,c&&c.selector?G:F,a)},teardown:function(a){f.event.remove(this,b,a&&a.selector?G:F)}}}),f.support.submitBubbles||(f.event.special.submit={setup:function(a,b){if(!f.nodeName(this,"form"))f.event.add(this,"click.specialSubmit",function(a){var b=a.target,c=b.type;(c==="submit"||c==="image")&&f(b).closest("form").length&&K("submit",this,arguments)}),f.event.add(this,"keypress.specialSubmit",function(a){var b=a.target,c=b.type;(c==="text"||c==="password")&&f(b).closest("form").length&&a.keyCode===13&&K("submit",this,arguments)});else return!1},teardown:function(a){f.event.remove(this,".specialSubmit")}});if(!f.support.changeBubbles){var H,I=function(a){var b=a.type,c=a.value;b==="radio"||b==="checkbox"?c=a.checked:b==="select-multiple"?c=a.selectedIndex>-1?f.map(a.options,function(a){return a.selected}).join("-"):"":f.nodeName(a,"select")&&(c=a.selectedIndex);return c},J=function J(a){var c=a.target,d,e;if(!!y.test(c.nodeName)&&!c.readOnly){d=f._data(c,"_change_data"),e=I(c),(a.type!=="focusout"||c.type!=="radio")&&f._data(c,"_change_data",e);if(d===b||e===d)return;if(d!=null||e)a.type="change",a.liveFired=b,f.event.trigger(a,arguments[1],c)}};f.event.special.change={filters:{focusout:J,beforedeactivate:J,click:function(a){var b=a.target,c=f.nodeName(b,"input")?b.type:"";(c==="radio"||c==="checkbox"||f.nodeName(b,"select"))&&J.call(this,a)},keydown:function(a){var b=a.target,c=f.nodeName(b,"input")?b.type:"";(a.keyCode===13&&!f.nodeName(b,"textarea")||a.keyCode===32&&(c==="checkbox"||c==="radio")||c==="select-multiple")&&J.call(this,a)},beforeactivate:function(a){var b=a.target;f._data(b,"_change_data",I(b))}},setup:function(a,b){if(this.type==="file")return!1;for(var c in H)f.event.add(this,c+".specialChange",H[c]);return y.test(this.nodeName)},teardown:function(a){f.event.remove(this,".specialChange");return y.test(this.nodeName)}},H=f.event.special.change.filters,H.focus=H.beforeactivate}f.support.focusinBubbles||f.each({focus:"focusin",blur:"focusout"},function(a,b){function e(a){var c=f.event.fix(a);c.type=b,c.originalEvent={},f.event.trigger(c,null,c.target),c.isDefaultPrevented()&&a.preventDefault()}var d=0;f.event.special[b]={setup:function(){d++===0&&c.addEventListener(a,e,!0)},teardown:function(){--d===0&&c.removeEventListener(a,e,!0)}}}),f.each(["bind","one"],function(a,c){f.fn[c]=function(a,d,e){var g;if(typeof a=="object"){for(var h in a)this[c](h,d,a[h],e);return this}if(arguments.length===2||d===!1)e=d,d=b;c==="one"?(g=function(a){f(this).unbind(a,g);return e.apply(this,arguments)},g.guid=e.guid||f.guid++):g=e;if(a==="unload"&&c!=="one")this.one(a,d,e);else for(var i=0,j=this.length;i<j;i++)f.event.add(this[i],a,g,d);return this}}),f.fn.extend({unbind:function(a,b){if(typeof a=="object"&&!a.preventDefault)for(var c in a)this.unbind(c,a[c]);else for(var d=0,e=this.length;d<e;d++)f.event.remove(this[d],a,b);return this},delegate:function(a,b,c,d){return this.live(b,c,d,a)},undelegate:function(a,b,c){return arguments.length===0?this.unbind("live"):this.die(b,null,c,a)},trigger:function(a,b){return this.each(function(){f.event.trigger(a,b,this)})},triggerHandler:function(a,b){if(this[0])return f.event.trigger(a,b,this[0],!0)},toggle:function(a){var b=arguments,c=a.guid||f.guid++,d=0,e=function(c){var e=(f.data(this,"lastToggle"+a.guid)||0)%d;f.data(this,"lastToggle"+a.guid,e+1),c.preventDefault();return b[e].apply(this,arguments)||!1};e.guid=c;while(d<b.length)b[d++].guid=c;return this.click(e)},hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}});var L={focus:"focusin",blur:"focusout",mouseenter:"mouseover",mouseleave:"mouseout"};f.each(["live","die"],function(a,c){f.fn[c]=function(a,d,e,g){var h,i=0,j,k,l,m=g||this.selector,n=g?this:f(this.context);if(typeof a=="object"&&!a.preventDefault){for(var o in a)n[c](o,d,a[o],m);return this}if(c==="die"&&!a&&g&&g.charAt(0)==="."){n.unbind(g);return this}if(d===!1||f.isFunction(d))e=d||D,d=b;a=(a||"").split(" ");while((h=a[i++])!=null){j=x.exec(h),k="",j&&(k=j[0],h=h.replace(x,""));if(h==="hover"){a.push("mouseenter"+k,"mouseleave"+k);continue}l=h,L[h]?(a.push(L[h]+k),h=h+k):h=(L[h]||h)+k;if(c==="live")for(var p=0,q=n.length;p<q;p++)f.event.add(n[p],"live."+N(h,m),{data:d,selector:m,handler:e,origType:h,origHandler:e,preType:l});else n.unbind("live."+N(h,m),e)}return this}}),f.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error".split(" "),function(a,b){f.fn[b]=function(a,c){c==null&&(c=a,a=null);return arguments.length>0?this.bind(b,a,c):this.trigger(b)},f.attrFn&&(f.attrFn[b]=!0)}),function(){function u(a,b,c,d,e,f){for(var g=0,h=d.length;g<h;g++){var i=d[g];if(i){var j=!1;i=i[a];while(i){if(i.sizcache===c){j=d[i.sizset];break}if(i.nodeType===1){f||(i.sizcache=c,i.sizset=g);if(typeof b!="string"){if(i===b){j=!0;break}}else if(k.filter(b,[i]).length>0){j=i;break}}i=i[a]}d[g]=j}}}function t(a,b,c,d,e,f){for(var g=0,h=d.length;g<h;g++){var i=d[g];if(i){var j=!1;i=i[a];while(i){if(i.sizcache===c){j=d[i.sizset];break}i.nodeType===1&&!f&&(i.sizcache=c,i.sizset=g);if(i.nodeName.toLowerCase()===b){j=i;break}i=i[a]}d[g]=j}}}var a=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,d=0,e=Object.prototype.toString,g=!1,h=!0,i=/\\/g,j=/\W/;[0,0].sort(function(){h=!1;return 0});var k=function(b,d,f,g){f=f||[],d=d||c;var h=d;if(d.nodeType!==1&&d.nodeType!==9)return[];if(!b||typeof b!="string")return f;var i,j,n,o,q,r,s,t,u=!0,w=k.isXML(d),x=[],y=b;do{a.exec(""),i=a.exec(y);if(i){y=i[3],x.push(i[1]);if(i[2]){o=i[3];break}}}while(i);if(x.length>1&&m.exec(b))if(x.length===2&&l.relative[x[0]])j=v(x[0]+x[1],d);else{j=l.relative[x[0]]?[d]:k(x.shift(),d);while(x.length)b=x.shift(),l.relative[b]&&(b+=x.shift()),j=v(b,j)}else{!g&&x.length>1&&d.nodeType===9&&!w&&l.match.ID.test(x[0])&&!l.match.ID.test(x[x.length-1])&&(q=k.find(x.shift(),d,w),d=q.expr?k.filter(q.expr,q.set)[0]:q.set[0]);if(d){q=g?{expr:x.pop(),set:p(g)}:k.find(x.pop(),x.length===1&&(x[0]==="~"||x[0]==="+")&&d.parentNode?d.parentNode:d,w),j=q.expr?k.filter(q.expr,q.set):q.set,x.length>0?n=p(j):u=!1;while(x.length)r=x.pop(),s=r,l.relative[r]?s=x.pop():r="",s==null&&(s=d),l.relative[r](n,s,w)}else n=x=[]}n||(n=j),n||k.error(r||b);if(e.call(n)==="[object Array]")if(!u)f.push.apply(f,n);else if(d&&d.nodeType===1)for(t=0;n[t]!=null;t++)n[t]&&(n[t]===!0||n[t].nodeType===1&&k.contains(d,n[t]))&&f.push(j[t]);else for(t=0;n[t]!=null;t++)n[t]&&n[t].nodeType===1&&f.push(j[t]);else p(n,f);o&&(k(o,h,f,g),k.uniqueSort(f));return f};k.uniqueSort=function(a){if(r){g=h,a.sort(r);if(g)for(var b=1;b<a.length;b++)a[b]===a[b-1]&&a.splice(b--,1)}return a},k.matches=function(a,b){return k(a,null,null,b)},k.matchesSelector=function(a,b){return k(b,null,null,[a]).length>0},k.find=function(a,b,c){var d;if(!a)return[];for(var e=0,f=l.order.length;e<f;e++){var g,h=l.order[e];if(g=l.leftMatch[h].exec(a)){var j=g[1];g.splice(1,1);if(j.substr(j.length-1)!=="\\"){g[1]=(g[1]||"").replace(i,""),d=l.find[h](g,b,c);if(d!=null){a=a.replace(l.match[h],"");break}}}}d||(d=typeof b.getElementsByTagName!="undefined"?b.getElementsByTagName("*"):[]);return{set:d,expr:a}},k.filter=function(a,c,d,e){var f,g,h=a,i=[],j=c,m=c&&c[0]&&k.isXML(c[0]);while(a&&c.length){for(var n in l.filter)if((f=l.leftMatch[n].exec(a))!=null&&f[2]){var o,p,q=l.filter[n],r=f[1];g=!1,f.splice(1,1);if(r.substr(r.length-1)==="\\")continue;j===i&&(i=[]);if(l.preFilter[n]){f=l.preFilter[n](f,j,d,i,e,m);if(!f)g=o=!0;else if(f===!0)continue}if(f)for(var s=0;(p=j[s])!=null;s++)if(p){o=q(p,f,s,j);var t=e^!!o;d&&o!=null?t?g=!0:j[s]=!1:t&&(i.push(p),g=!0)}if(o!==b){d||(j=i),a=a.replace(l.match[n],"");if(!g)return[];break}}if(a===h)if(g==null)k.error(a);else break;h=a}return j},k.error=function(a){throw"Syntax error, unrecognized expression: "+a};var l=k.selectors={order:["ID","NAME","TAG"],match:{ID:/#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,CLASS:/\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,ATTR:/\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,TAG:/^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,CHILD:/:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,PSEUDO:/:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/},leftMatch:{},attrMap:{"class":"className","for":"htmlFor"},attrHandle:{href:function(a){return a.getAttribute("href")},type:function(a){return a.getAttribute("type")}},relative:{"+":function(a,b){var c=typeof b=="string",d=c&&!j.test(b),e=c&&!d;d&&(b=b.toLowerCase());for(var f=0,g=a.length,h;f<g;f++)if(h=a[f]){while((h=h.previousSibling)&&h.nodeType!==1);a[f]=e||h&&h.nodeName.toLowerCase()===b?h||!1:h===b}e&&k.filter(b,a,!0)},">":function(a,b){var c,d=typeof b=="string",e=0,f=a.length;if(d&&!j.test(b)){b=b.toLowerCase();for(;e<f;e++){c=a[e];if(c){var g=c.parentNode;a[e]=g.nodeName.toLowerCase()===b?g:!1}}}else{for(;e<f;e++)c=a[e],c&&(a[e]=d?c.parentNode:c.parentNode===b);d&&k.filter(b,a,!0)}},"":function(a,b,c){var e,f=d++,g=u;typeof b=="string"&&!j.test(b)&&(b=b.toLowerCase(),e=b,g=t),g("parentNode",b,f,a,e,c)},"~":function(a,b,c){var e,f=d++,g=u;typeof b=="string"&&!j.test(b)&&(b=b.toLowerCase(),e=b,g=t),g("previousSibling",b,f,a,e,c)}},find:{ID:function(a,b,c){if(typeof b.getElementById!="undefined"&&!c){var d=b.getElementById(a[1]);return d&&d.parentNode?[d]:[]}},NAME:function(a,b){if(typeof b.getElementsByName!="undefined"){var c=[],d=b.getElementsByName(a[1]);for(var e=0,f=d.length;e<f;e++)d[e].getAttribute("name")===a[1]&&c.push(d[e]);return c.length===0?null:c}},TAG:function(a,b){if(typeof b.getElementsByTagName!="undefined")return b.getElementsByTagName(a[1])}},preFilter:{CLASS:function(a,b,c,d,e,f){a=" "+a[1].replace(i,"")+" ";if(f)return a;for(var g=0,h;(h=b[g])!=null;g++)h&&(e^(h.className&&(" "+h.className+" ").replace(/[\t\n\r]/g," ").indexOf(a)>=0)?c||d.push(h):c&&(b[g]=!1));return!1},ID:function(a){return a[1].replace(i,"")},TAG:function(a,b){return a[1].replace(i,"").toLowerCase()},CHILD:function(a){if(a[1]==="nth"){a[2]||k.error(a[0]),a[2]=a[2].replace(/^\+|\s*/g,"");var b=/(-?)(\d*)(?:n([+\-]?\d*))?/.exec(a[2]==="even"&&"2n"||a[2]==="odd"&&"2n+1"||!/\D/.test(a[2])&&"0n+"+a[2]||a[2]);a[2]=b[1]+(b[2]||1)-0,a[3]=b[3]-0}else a[2]&&k.error(a[0]);a[0]=d++;return a},ATTR:function(a,b,c,d,e,f){var g=a[1]=a[1].replace(i,"");!f&&l.attrMap[g]&&(a[1]=l.attrMap[g]),a[4]=(a[4]||a[5]||"").replace(i,""),a[2]==="~="&&(a[4]=" "+a[4]+" ");return a},PSEUDO:function(b,c,d,e,f){if(b[1]==="not")if((a.exec(b[3])||"").length>1||/^\w/.test(b[3]))b[3]=k(b[3],null,null,c);else{var g=k.filter(b[3],c,d,!0^f);d||e.push.apply(e,g);return!1}else if(l.match.POS.test(b[0])||l.match.CHILD.test(b[0]))return!0;return b},POS:function(a){a.unshift(!0);return a}},filters:{enabled:function(a){return a.disabled===!1&&a.type!=="hidden"},disabled:function(a){return a.disabled===!0},checked:function(a){return a.checked===!0},selected:function(a){a.parentNode&&a.parentNode.selectedIndex;return a.selected===!0},parent:function(a){return!!a.firstChild},empty:function(a){return!a.firstChild},has:function(a,b,c){return!!k(c[3],a).length},header:function(a){return/h\d/i.test(a.nodeName)},text:function(a){var b=a.getAttribute("type"),c=a.type;return a.nodeName.toLowerCase()==="input"&&"text"===c&&(b===c||b===null)},radio:function(a){return a.nodeName.toLowerCase()==="input"&&"radio"===a.type},checkbox:function(a){return a.nodeName.toLowerCase()==="input"&&"checkbox"===a.type},file:function(a){return a.nodeName.toLowerCase()==="input"&&"file"===a.type},password:function(a){return a.nodeName.toLowerCase()==="input"&&"password"===a.type},submit:function(a){var b=a.nodeName.toLowerCase();return(b==="input"||b==="button")&&"submit"===a.type},image:function(a){return a.nodeName.toLowerCase()==="input"&&"image"===a.type},reset:function(a){return a.nodeName.toLowerCase()==="input"&&"reset"===a.type},button:function(a){var b=a.nodeName.toLowerCase();return b==="input"&&"button"===a.type||b==="button"},input:function(a){return/input|select|textarea|button/i.test(a.nodeName)},focus:function(a){return a===a.ownerDocument.activeElement}},setFilters:{first:function(a,b){return b===0},last:function(a,b,c,d){return b===d.length-1},even:function(a,b){return b%2===0},odd:function(a,b){return b%2===1},lt:function(a,b,c){return b<c[3]-0},gt:function(a,b,c){return b>c[3]-0},nth:function(a,b,c){return c[3]-0===b},eq:function(a,b,c){return c[3]-0===b}},filter:{PSEUDO:function(a,b,c,d){var e=b[1],f=l.filters[e];if(f)return f(a,c,b,d);if(e==="contains")return(a.textContent||a.innerText||k.getText([a])||"").indexOf(b[3])>=0;if(e==="not"){var g=b[3];for(var h=0,i=g.length;h<i;h++)if(g[h]===a)return!1;return!0}k.error(e)},CHILD:function(a,b){var c=b[1],d=a;switch(c){case"only":case"first":while(d=d.previousSibling)if(d.nodeType===1)return!1;if(c==="first")return!0;d=a;case"last":while(d=d.nextSibling)if(d.nodeType===1)return!1;return!0;case"nth":var e=b[2],f=b[3];if(e===1&&f===0)return!0;var g=b[0],h=a.parentNode;if(h&&(h.sizcache!==g||!a.nodeIndex)){var i=0;for(d=h.firstChild;d;d=d.nextSibling)d.nodeType===1&&(d.nodeIndex=++i);h.sizcache=g}var j=a.nodeIndex-f;return e===0?j===0:j%e===0&&j/e>=0}},ID:function(a,b){return a.nodeType===1&&a.getAttribute("id")===b},TAG:function(a,b){return b==="*"&&a.nodeType===1||a.nodeName.toLowerCase()===b},CLASS:function(a,b){return(" "+(a.className||a.getAttribute("class"))+" ").indexOf(b)>-1},ATTR:function(a,b){var c=b[1],d=l.attrHandle[c]?l.attrHandle[c](a):a[c]!=null?a[c]:a.getAttribute(c),e=d+"",f=b[2],g=b[4];return d==null?f==="!=":f==="="?e===g:f==="*="?e.indexOf(g)>=0:f==="~="?(" "+e+" ").indexOf(g)>=0:g?f==="!="?e!==g:f==="^="?e.indexOf(g)===0:f==="$="?e.substr(e.length-g.length)===g:f==="|="?e===g||e.substr(0,g.length+1)===g+"-":!1:e&&d!==!1},POS:function(a,b,c,d){var e=b[2],f=l.setFilters[e];if(f)return f(a,c,b,d)}}},m=l.match.POS,n=function(a,b){return"\\"+(b-0+1)};for(var o in l.match)l.match[o]=new RegExp(l.match[o].source+/(?![^\[]*\])(?![^\(]*\))/.source),l.leftMatch[o]=new RegExp(/(^(?:.|\r|\n)*?)/.source+l.match[o].source.replace(/\\(\d+)/g,n));var p=function(a,b){a=Array.prototype.slice.call(a,0);if(b){b.push.apply(b,a);return b}return a};try{Array.prototype.slice.call(c.documentElement.childNodes,0)[0].nodeType}catch(q){p=function(a,b){var c=0,d=b||[];if(e.call(a)==="[object Array]")Array.prototype.push.apply(d,a);else if(typeof a.length=="number")for(var f=a.length;c<f;c++)d.push(a[c]);else for(;a[c];c++)d.push(a[c]);return d}}var r,s;c.documentElement.compareDocumentPosition?r=function(a,b){if(a===b){g=!0;return 0}if(!a.compareDocumentPosition||!b.compareDocumentPosition)return a.compareDocumentPosition?-1:1;return a.compareDocumentPosition(b)&4?-1:1}:(r=function(a,b){var c,d,e=[],f=[],h=a.parentNode,i=b.parentNode,j=h;if(a===b){g=!0;return 0}if(h===i)return s(a,b);if(!h)return-1;if(!i)return 1;while(j)e.unshift(j),j=j.parentNode;j=i;while(j)f.unshift(j),j=j.parentNode;c=e.length,d=f.length;for(var k=0;k<c&&k<d;k++)if(e[k]!==f[k])return s(e[k],f[k]);return k===c?s(a,f[k],-1):s(e[k],b,1)},s=function(a,b,c){if(a===b)return c;var d=a.nextSibling;while(d){if(d===b)return-1;d=d.nextSibling}return 1}),k.getText=function(a){var b="",c;for(var d=0;a[d];d++)c=a[d],c.nodeType===3||c.nodeType===4?b+=c.nodeValue:c.nodeType!==8&&(b+=k.getText(c.childNodes));return b},function(){var a=c.createElement("div"),d="script"+(new Date).getTime(),e=c.documentElement;a.innerHTML="<a name='"+d+"'/>",e.insertBefore(a,e.firstChild),c.getElementById(d)&&(l.find.ID=function(a,c,d){if(typeof c.getElementById!="undefined"&&!d){var e=c.getElementById(a[1]);return e?e.id===a[1]||typeof e.getAttributeNode!="undefined"&&e.getAttributeNode("id").nodeValue===a[1]?[e]:b:[]}},l.filter.ID=function(a,b){var c=typeof a.getAttributeNode!="undefined"&&a.getAttributeNode("id");return a.nodeType===1&&c&&c.nodeValue===b}),e.removeChild(a),e=a=null}(),function(){var a=c.createElement("div");a.appendChild(c.createComment("")),a.getElementsByTagName("*").length>0&&(l.find.TAG=function(a,b){var c=b.getElementsByTagName(a[1]);if(a[1]==="*"){var d=[];for(var e=0;c[e];e++)c[e].nodeType===1&&d.push(c[e]);c=d}return c}),a.innerHTML="<a href='#'></a>",a.firstChild&&typeof a.firstChild.getAttribute!="undefined"&&a.firstChild.getAttribute("href")!=="#"&&(l.attrHandle.href=function(a){return a.getAttribute("href",2)}),a=null}(),c.querySelectorAll&&function(){var a=k,b=c.createElement("div"),d="__sizzle__";b.innerHTML="<p class='TEST'></p>";if(!b.querySelectorAll||b.querySelectorAll(".TEST").length!==0){k=function(b,e,f,g){e=e||c;if(!g&&!k.isXML(e)){var h=/^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(b);if(h&&(e.nodeType===1||e.nodeType===9)){if(h[1])return p(e.getElementsByTagName(b),f);if(h[2]&&l.find.CLASS&&e.getElementsByClassName)return p(e.getElementsByClassName(h[2]),f)}if(e.nodeType===9){if(b==="body"&&e.body)return p([e.body],f);if(h&&h[3]){var i=e.getElementById(h[3]);if(!i||!i.parentNode)return p([],f);if(i.id===h[3])return p([i],f)}try{return p(e.querySelectorAll(b),f)}catch(j){}}else if(e.nodeType===1&&e.nodeName.toLowerCase()!=="object"){var m=e,n=e.getAttribute("id"),o=n||d,q=e.parentNode,r=/^\s*[+~]/.test(b);n?o=o.replace(/'/g,"\\$&"):e.setAttribute("id",o),r&&q&&(e=e.parentNode);try{if(!r||q)return p(e.querySelectorAll("[id='"+o+"'] "+b),f)}catch(s){}finally{n||m.removeAttribute("id")}}}return a(b,e,f,g)};for(var e in a)k[e]=a[e];b=null}}(),function(){var a=c.documentElement,b=a.matchesSelector||a.mozMatchesSelector||a.webkitMatchesSelector||a.msMatchesSelector;if(b){var d=!b.call(c.createElement("div"),"div"),e=!1;try{b.call(c.documentElement,"[test!='']:sizzle")}catch(f){e=!0}k.matchesSelector=function(a,c){c=c.replace(/\=\s*([^'"\]]*)\s*\]/g,"='$1']");if(!k.isXML(a))try{if(e||!l.match.PSEUDO.test(c)&&!/!=/.test(c)){var f=b.call(a,c);if(f||!d||a.document&&a.document.nodeType!==11)return f}}catch(g){}return k(c,null,null,[a]).length>0}}}(),function(){var a=c.createElement("div");a.innerHTML="<div class='test e'></div><div class='test'></div>";if(!!a.getElementsByClassName&&a.getElementsByClassName("e").length!==0){a.lastChild.className="e";if(a.getElementsByClassName("e").length===1)return;l.order.splice(1,0,"CLASS"),l.find.CLASS=function(a,b,c){if(typeof b.getElementsByClassName!="undefined"&&!c)return b.getElementsByClassName(a[1])},a=null}}(),c.documentElement.contains?k.contains=function(a,b){return a!==b&&(a.contains?a.contains(b):!0)}:c.documentElement.compareDocumentPosition?k.contains=function(a,b){return!!(a.compareDocumentPosition(b)&16)}:k.contains=function(){return!1},k.isXML=function(a){var b=(a?a.ownerDocument||a:0).documentElement;return b?b.nodeName!=="HTML":!1};var v=function(a,b){var c,d=[],e="",f=b.nodeType?[b]:b;while(c=l.match.PSEUDO.exec(a))e+=c[0],a=a.replace(l.match.PSEUDO,"");a=l.relative[a]?a+"*":a;for(var g=0,h=f.length;g<h;g++)k(a,f[g],d);return k.filter(e,d)};f.find=k,f.expr=k.selectors,f.expr[":"]=f.expr.filters,f.unique=k.uniqueSort,f.text=k.getText,f.isXMLDoc=k.isXML,f.contains=k.contains}();var O=/Until$/,P=/^(?:parents|prevUntil|prevAll)/,Q=/,/,R=/^.[^:#\[\.,]*$/,S=Array.prototype.slice,T=f.expr.match.POS,U={children:!0,contents:!0,next:!0,prev:!0};f.fn.extend({find:function(a){var b=this,c,d;if(typeof a!="string")return f(a).filter(function(){for(c=0,d=b.length;c<d;c++)if(f.contains(b[c],this))return!0});var e=this.pushStack("","find",a),g,h,i;for(c=0,d=this.length;c<d;c++){g=e.length,f.find(a,this[c],e);if(c>0)for(h=g;h<e.length;h++)for(i=0;i<g;i++)if(e[i]===e[h]){e.splice(h--,1);break}}return e},has:function(a){var b=f(a);return this.filter(function(){for(var a=0,c=b.length;a<c;a++)if(f.contains(this,b[a]))return!0})},not:function(a){return this.pushStack(W(this,a,!1),"not",a)},filter:function(a){return this.pushStack(W(this,a,!0),"filter",a)},is:function(a){return!!a&&(typeof a=="string"?f.filter(a,this).length>0:this.filter(a).length>0)},closest:function(a,b){var c=[],d,e,g=this[0];if(f.isArray(a)){var h,i,j={},k=1;if(g&&a.length){for(d=0,e=a.length;d<e;d++)i=a[d],j[i]||(j[i]=T.test(i)?f(i,b||this.context):i);while(g&&g.ownerDocument&&g!==b){for(i in j)h=j[i],(h.jquery?h.index(g)>-1:f(g).is(h))&&c.push({selector:i,elem:g,level:k});g=g.parentNode,k++}}return c}var l=T.test(a)||typeof a!="string"?f(a,b||this.context):0;for(d=0,e=this.length;d<e;d++){g=this[d];while(g){if(l?l.index(g)>-1:f.find.matchesSelector(g,a)){c.push(g);break}g=g.parentNode;if(!g||!g.ownerDocument||g===b||g.nodeType===11)break}}c=c.length>1?f.unique(c):c;return this.pushStack(c,"closest",a)},index:function(a){if(!a||typeof a=="string")return f.inArray(this[0],a?f(a):this.parent().children());return f.inArray(a.jquery?a[0]:a,this)},add:function(a,b){var c=typeof a=="string"?f(a,b):f.makeArray(a&&a.nodeType?[a]:a),d=f.merge(this.get(),c);return this.pushStack(V(c[0])||V(d[0])?d:f.unique(d))},andSelf:function(){return this.add(this.prevObject)}}),f.each({parent:function(a){var b=a.parentNode;return b&&b.nodeType!==11?b:null},parents:function(a){return f.dir(a,"parentNode")},parentsUntil:function(a,b,c){return f.dir(a,"parentNode",c)},next:function(a){return f.nth(a,2,"nextSibling")},prev:function(a){return f.nth(a,2,"previousSibling")},nextAll:function(a){return f.dir(a,"nextSibling")},prevAll:function(a){return f.dir(a,"previousSibling")},nextUntil:function(a,b,c){return f.dir(a,"nextSibling",c)},prevUntil:function(a,b,c){return f.dir(a,"previousSibling",c)},siblings:function(a){return f.sibling(a.parentNode.firstChild,a)},children:function(a){return f.sibling(a.firstChild)},contents:function(a){return f.nodeName(a,"iframe")?a.contentDocument||a.contentWindow.document:f.makeArray(a.childNodes)}},function(a,b){f.fn[a]=function(c,d){var e=f.map(this,b,c),g=S.call(arguments);O.test(a)||(d=c),d&&typeof d=="string"&&(e=f.filter(d,e)),e=this.length>1&&!U[a]?f.unique(e):e,(this.length>1||Q.test(d))&&P.test(a)&&(e=e.reverse());return this.pushStack(e,a,g.join(","))}}),f.extend({filter:function(a,b,c){c&&(a=":not("+a+")");return b.length===1?f.find.matchesSelector(b[0],a)?[b[0]]:[]:f.find.matches(a,b)},dir:function(a,c,d){var e=[],g=a[c];while(g&&g.nodeType!==9&&(d===b||g.nodeType!==1||!f(g).is(d)))g.nodeType===1&&e.push(g),g=g[c];return e},nth:function(a,b,c,d){b=b||1;var e=0;for(;a;a=a[c])if(a.nodeType===1&&++e===b)break;return a},sibling:function(a,b){var c=[];for(;a;a=a.nextSibling)a.nodeType===1&&a!==b&&c.push(a);return c}});var X=/ jQuery\d+="(?:\d+|null)"/g,Y=/^\s+/,Z=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,$=/<([\w:]+)/,_=/<tbody/i,ba=/<|&#?\w+;/,bb=/<(?:script|object|embed|option|style)/i,bc=/checked\s*(?:[^=]|=\s*.checked.)/i,bd=/\/(java|ecma)script/i,be={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],area:[1,"<map>","</map>"],_default:[0,"",""]};be.optgroup=be.option,be.tbody=be.tfoot=be.colgroup=be.caption=be.thead,be.th=be.td,f.support.htmlSerialize||(be._default=[1,"div<div>","</div>"]),f.fn.extend({text:function(a){if(f.isFunction(a))return this.each(function(b){var c=f(this);c.text(a.call(this,b,c.text()))});if(typeof a!="object"&&a!==b)return this.empty().append((this[0]&&this[0].ownerDocument||c).createTextNode(a));return f.text(this)},wrapAll:function(a){if(f.isFunction(a))return this.each(function(b){f(this).wrapAll(a.call(this,b))});if(this[0]){var b=f(a,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstChild&&a.firstChild.nodeType===1)a=a.firstChild;return a}).append(this)}return this},wrapInner:function(a){if(f.isFunction(a))return this.each(function(b){f(this).wrapInner(a.call(this,b))});return this.each(function(){var b=f(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){return this.each(function(){f(this).wrapAll(a)})},unwrap:function(){return this.parent().each(function(){f.nodeName(this,"body")||f(this).replaceWith(this.childNodes)}).end()},append:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.appendChild(a)})},prepend:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.insertBefore(a,this.firstChild)})},before:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this)});if(arguments.length){var a=f(arguments[0]);a.push.apply(a,this.toArray());return this.pushStack(a,"before",arguments)}},after:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this.nextSibling)});if(arguments.length){var a=this.pushStack(this,"after",arguments);a.push.apply(a,f(arguments[0]).toArray());return a}},remove:function(a,b){for(var c=0,d;(d=this[c])!=null;c++)if(!a||f.filter(a,[d]).length)!b&&d.nodeType===1&&(f.cleanData(d.getElementsByTagName("*")),f.cleanData([d])),d.parentNode&&d.parentNode.removeChild(d);return this},empty:function(){for(var a=0,b;(b=this[a])!=null;a++){b.nodeType===1&&f.cleanData(b.getElementsByTagName("*"));while(b.firstChild)b.removeChild(b.firstChild)}return this},clone:function(a,b){a=a==null?!1:a,b=b==null?a:b;return this.map(function(){return f.clone(this,a,b)})},html:function(a){if(a===b)return this[0]&&this[0].nodeType===1?this[0].innerHTML.replace(X,""):null;if(typeof a=="string"&&!bb.test(a)&&(f.support.leadingWhitespace||!Y.test(a))&&!be[($.exec(a)||["",""])[1].toLowerCase()]){a=a.replace(Z,"<$1></$2>");try{for(var c=0,d=this.length;c<d;c++)this[c].nodeType===1&&(f.cleanData(this[c].getElementsByTagName("*")),this[c].innerHTML=a)}catch(e){this.empty().append(a)}}else f.isFunction(a)?this.each(function(b){var c=f(this);c.html(a.call(this,b,c.html()))}):this.empty().append(a);return this},replaceWith:function(a){if(this[0]&&this[0].parentNode){if(f.isFunction(a))return this.each(function(b){var c=f(this),d=c.html();c.replaceWith(a.call(this,b,d))});typeof a!="string"&&(a=f(a).detach());return this.each(function(){var b=this.nextSibling,c=this.parentNode;f(this).remove(),b?f(b).before(a):f(c).append(a)})}return this.length?this.pushStack(f(f.isFunction(a)?a():a),"replaceWith",a):this},detach:function(a){return this.remove(a,!0)},domManip:function(a,c,d){var e,g,h,i,j=a[0],k=[];if(!f.support.checkClone&&arguments.length===3&&typeof j=="string"&&bc.test(j))return this.each(function(){f(this).domManip(a,c,d,!0)});if(f.isFunction(j))return this.each(function(e){var g=f(this);a[0]=j.call(this,e,c?g.html():b),g.domManip(a,c,d)});if(this[0]){i=j&&j.parentNode,f.support.parentNode&&i&&i.nodeType===11&&i.childNodes.length===this.length?e={fragment:i}:e=f.buildFragment(a,this,k),h=e.fragment,h.childNodes.length===1?g=h=h.firstChild:g=h.firstChild;if(g){c=c&&f.nodeName(g,"tr");for(var l=0,m=this.length,n=m-1;l<m;l++)d.call(c?bf(this[l],g):this[l],e.cacheable||m>1&&l<n?f.clone(h,!0,!0):h)}k.length&&f.each(k,bl)}return this}}),f.buildFragment=function(a,b,d){var e,g,h,i=b&&b[0]?b[0].ownerDocument||b[0]:c;a.length===1&&typeof a[0]=="string"&&a[0].length<512&&i===c&&a[0].charAt(0)==="<"&&!bb.test(a[0])&&(f.support.checkClone||!bc.test(a[0]))&&(g=!0,h=f.fragments[a[0]],h&&h!==1&&(e=h)),e||(e=i.createDocumentFragment(),f.clean(a,i,e,d)),g&&(f.fragments[a[0]]=h?e:1);return{fragment:e,cacheable:g}},f.fragments={},f.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){f.fn[a]=function(c){var d=[],e=f(c),g=this.length===1&&this[0].parentNode;if(g&&g.nodeType===11&&g.childNodes.length===1&&e.length===1){e[b](this[0]);return this}for(var h=0,i=e.length;h<i;h++){var j=(h>0?this.clone(!0):this).get();f(e[h])[b](j),d=d.concat(j)}return this.pushStack(d,a,e.selector)}}),f.extend({clone:function(a,b,c){var d=a.cloneNode(!0),e,g,h;if((!f.support.noCloneEvent||!f.support.noCloneChecked)&&(a.nodeType===1||a.nodeType===11)&&!f.isXMLDoc(a)){bh(a,d),e=bi(a),g=bi(d);for(h=0;e[h];++h)bh(e[h],g[h])}if(b){bg(a,d);if(c){e=bi(a),g=bi(d);for(h=0;e[h];++h)bg(e[h],g[h])}}return d},clean:function(a,b,d,e){var g;b=b||c,typeof b.createElement=="undefined"&&(b=b.ownerDocument||b[0]&&b[0].ownerDocument||c);var h=[];for(var i=0,j;(j=a[i])!=null;i++){typeof j=="number"&&(j+="");if(!j)continue;if(typeof j=="string")if(!ba.test(j))j=b.createTextNode(j);else{j=j.replace(Z,"<$1></$2>");var k=($.exec(j)||["",""])[1].toLowerCase(),l=be[k]||be._default,m=l[0],n=b.createElement("div");n.innerHTML=l[1]+j+l[2];while(m--)n=n.lastChild;if(!f.support.tbody){var o=_.test(j),p=k==="table"&&!o?n.firstChild&&n.firstChild.childNodes:l[1]==="<table>"&&!o?n.childNodes:[];for(var q=p.length-1;q>=0;--q)f.nodeName(p[q],"tbody")&&!p[q].childNodes.length&&p[q].parentNode.removeChild(p[q])}!f.support.leadingWhitespace&&Y.test(j)&&n.insertBefore(b.createTextNode(Y.exec(j)[0]),n.firstChild),j=n.childNodes}var r;if(!f.support.appendChecked)if(j[0]&&typeof (r=j.length)=="number")for(i=0;i<r;i++)bk(j[i]);else bk(j);j.nodeType?h.push(j):h=f.merge(h,j)}if(d){g=function(a){return!a.type||bd.test(a.type)};for(i=0;h[i];i++)if(e&&f.nodeName(h[i],"script")&&(!h[i].type||h[i].type.toLowerCase()==="text/javascript"))e.push(h[i].parentNode?h[i].parentNode.removeChild(h[i]):h[i]);else{if(h[i].nodeType===1){var s=f.grep(h[i].getElementsByTagName("script"),g);h.splice.apply(h,[i+1,0].concat(s))}d.appendChild(h[i])}}return h},cleanData:function(a){var b,c,d=f.cache,e=f.expando,g=f.event.special,h=f.support.deleteExpando;for(var i=0,j;(j=a[i])!=null;i++){if(j.nodeName&&f.noData[j.nodeName.toLowerCase()])continue;c=j[f.expando];if(c){b=d[c]&&d[c][e];if(b&&b.events){for(var k in b.events)g[k]?f.event.remove(j,k):f.removeEvent(j,k,b.handle);b.handle&&(b.handle.elem=null)}h?delete j[f.expando]:j.removeAttribute&&j.removeAttribute(f.expando),delete d[c]}}}});var bm=/alpha\([^)]*\)/i,bn=/opacity=([^)]*)/,bo=/-([a-z])/ig,bp=/([A-Z]|^ms)/g,bq=/^-?\d+(?:px)?$/i,br=/^-?\d/,bs=/^[+\-]=/,bt=/[^+\-\.\de]+/g,bu={position:"absolute",visibility:"hidden",display:"block"},bv=["Left","Right"],bw=["Top","Bottom"],bx,by,bz,bA=function(a,b){return b.toUpperCase()};f.fn.css=function(a,c){if(arguments.length===2&&c===b)return this;return f.access(this,a,c,!0,function(a,c,d){return d!==b?f.style(a,c,d):f.css(a,c)})},f.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=bx(a,"opacity","opacity");return c===""?"1":c}return a.style.opacity}}},cssNumber:{zIndex:!0,fontWeight:!0,opacity:!0,zoom:!0,lineHeight:!0,widows:!0,orphans:!0},cssProps:{"float":f.support.cssFloat?"cssFloat":"styleFloat"},style:function(a,c,d,e){if(!!a&&a.nodeType!==3&&a.nodeType!==8&&!!a.style){var g,h,i=f.camelCase(c),j=a.style,k=f.cssHooks[i];c=f.cssProps[i]||i;if(d===b){if(k&&"get"in k&&(g=k.get(a,!1,e))!==b)return g;return j[c]}h=typeof d;if(h==="number"&&isNaN(d)||d==null)return;h==="string"&&bs.test(d)&&(d=+d.replace(bt,"")+parseFloat(f.css(a,c))),h==="number"&&!f.cssNumber[i]&&(d+="px");if(!k||!("set"in k)||(d=k.set(a,d))!==b)try{j[c]=d}catch(l){}}},css:function(a,c,d){var e,g;c=f.camelCase(c),g=f.cssHooks[c],c=f.cssProps[c]||c,c==="cssFloat"&&(c="float");if(g&&"get"in g&&(e=g.get(a,!0,d))!==b)return e;if(bx)return bx(a,c)},swap:function(a,b,c){var d={};for(var e in b)d[e]=a.style[e],a.style[e]=b[e];c.call(a);for(e in b)a.style[e]=d[e]},camelCase:function(a){return a.replace(bo,bA)}}),f.curCSS=f.css,f.each(["height","width"],function(a,b){f.cssHooks[b]={get:function(a,c,d){var e;if(c){a.offsetWidth!==0?e=bB(a,b,d):f.swap(a,bu,function(){e=bB(a,b,d)});if(e<=0){e=bx(a,b,b),e==="0px"&&bz&&(e=bz(a,b,b));if(e!=null)return e===""||e==="auto"?"0px":e}if(e<0||e==null){e=a.style[b];return e===""||e==="auto"?"0px":e}return typeof e=="string"?e:e+"px"}},set:function(a,b){if(!bq.test(b))return b;b=parseFloat(b);if(b>=0)return b+"px"}}}),f.support.opacity||(f.cssHooks.opacity={get:function(a,b){return bn.test((b&&a.currentStyle?a.currentStyle.filter:a.style.filter)||"")?parseFloat(RegExp.$1)/100+"":b?"1":""},set:function(a,b){var c=a.style,d=a.currentStyle;c.zoom=1;var e=f.isNaN(b)?"":"alpha(opacity="+b*100+")",g=d&&d.filter||c.filter||"";c.filter=bm.test(g)?g.replace(bm,e):g+" "+e}}),f(function(){f.support.reliableMarginRight||(f.cssHooks.marginRight={get:function(a,b){var c;f.swap(a,{display:"inline-block"},function(){b?c=bx(a,"margin-right","marginRight"):c=a.style.marginRight});return c}})}),c.defaultView&&c.defaultView.getComputedStyle&&(by=function(a,c){var d,e,g;c=c.replace(bp,"-$1").toLowerCase();if(!(e=a.ownerDocument.defaultView))return b;if(g=e.getComputedStyle(a,null))d=g.getPropertyValue(c),d===""&&!f.contains(a.ownerDocument.documentElement,a)&&(d=f.style(a,c));return d}),c.documentElement.currentStyle&&(bz=function(a,b){var c,d=a.currentStyle&&a.currentStyle[b],e=a.runtimeStyle&&a.runtimeStyle[b],f=a.style;!bq.test(d)&&br.test(d)&&(c=f.left,e&&(a.runtimeStyle.left=a.currentStyle.left),f.left=b==="fontSize"?"1em":d||0,d=f.pixelLeft+"px",f.left=c,e&&(a.runtimeStyle.left=e));return d===""?"auto":d}),bx=by||bz,f.expr&&f.expr.filters&&(f.expr.filters.hidden=function(a){var b=a.offsetWidth,c=a.offsetHeight;return b===0&&c===0||!f.support.reliableHiddenOffsets&&(a.style.display||f.css(a,"display"))==="none"},f.expr.filters.visible=function(a){return!f.expr.filters.hidden(a)});var bC=/%20/g,bD=/\[\]$/,bE=/\r?\n/g,bF=/#.*$/,bG=/^(.*?):[ \t]*([^\r\n]*)\r?$/mg,bH=/^(?:color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,bI=/^(?:about|app|app\-storage|.+\-extension|file|widget):$/,bJ=/^(?:GET|HEAD)$/,bK=/^\/\//,bL=/\?/,bM=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,bN=/^(?:select|textarea)/i,bO=/\s+/,bP=/([?&])_=[^&]*/,bQ=/^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,bR=f.fn.load,bS={},bT={},bU,bV;try{bU=e.href}catch(bW){bU=c.createElement("a"),bU.href="",bU=bU.href}bV=bQ.exec(bU.toLowerCase())||[],f.fn.extend({load:function(a,c,d){if(typeof a!="string"&&bR)return bR.apply(this,arguments);if(!this.length)return this;var e=a.indexOf(" ");if(e>=0){var g=a.slice(e,a.length);a=a.slice(0,e)}var h="GET";c&&(f.isFunction(c)?(d=c,c=b):typeof c=="object"&&(c=f.param(c,f.ajaxSettings.traditional),h="POST"));var i=this;f.ajax({url:a,type:h,dataType:"html",data:c,complete:function(a,b,c){c=a.responseText,a.isResolved()&&(a.done(function(a){c=a}),i.html(g?f("<div>").append(c.replace(bM,"")).find(g):c)),d&&i.each(d,[c,b,a])}});return this},serialize:function(){return f.param(this.serializeArray())},serializeArray:function(){return this.map(function(){return this.elements?f.makeArray(this.elements):this}).filter(function(){return this.name&&!this.disabled&&(this.checked||bN.test(this.nodeName)||bH.test(this.type))}).map(function(a,b){var c=f(this).val();return c==null?null:f.isArray(c)?f.map(c,function(a,c){return{name:b.name,value:a.replace(bE,"\r\n")}}):{name:b.name,value:c.replace(bE,"\r\n")}}).get()}}),f.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "),function(a,b){f.fn[b]=function(a){return this.bind(b,a)}}),f.each(["get","post"],function(a,c){f[c]=function(a,d,e,g){f.isFunction(d)&&(g=g||e,e=d,d=b);return f.ajax({type:c,url:a,data:d,success:e,dataType:g})}}),f.extend({getScript:function(a,c){return f.get(a,b,c,"script")},getJSON:function(a,b,c){return f.get(a,b,c,"json")},ajaxSetup:function(a,b){b?f.extend(!0,a,f.ajaxSettings,b):(b=a,a=f.extend(!0,f.ajaxSettings,b));for(var c in{context:1,url:1})c in b?a[c]=b[c]:c in f.ajaxSettings&&(a[c]=f.ajaxSettings[c]);return a},ajaxSettings:{url:bU,isLocal:bI.test(bV[1]),global:!0,type:"GET",contentType:"application/x-www-form-urlencoded",processData:!0,async:!0,accepts:{xml:"application/xml, text/xml",html:"text/html",text:"text/plain",json:"application/json, text/javascript","*":"*/*"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText"},converters:{"* text":a.String,"text html":!0,"text json":f.parseJSON,"text xml":f.parseXML}},ajaxPrefilter:bX(bS),ajaxTransport:bX(bT),ajax:function(a,c){function w(a,c,l,m){if(s!==2){s=2,q&&clearTimeout(q),p=b,n=m||"",v.readyState=a?4:0;var o,r,u,w=l?b$(d,v,l):b,x,y;if(a>=200&&a<300||a===304){if(d.ifModified){if(x=v.getResponseHeader("Last-Modified"))f.lastModified[k]=x;if(y=v.getResponseHeader("Etag"))f.etag[k]=y}if(a===304)c="notmodified",o=!0;else try{r=b_(d,w),c="success",o=!0}catch(z){c="parsererror",u=z}}else{u=c;if(!c||a)c="error",a<0&&(a=0)}v.status=a,v.statusText=c,o?h.resolveWith(e,[r,c,v]):h.rejectWith(e,[v,c,u]),v.statusCode(j),j=b,t&&g.trigger("ajax"+(o?"Success":"Error"),[v,d,o?r:u]),i.resolveWith(e,[v,c]),t&&(g.trigger("ajaxComplete",[v,d]),--f.active||f.event.trigger("ajaxStop"))}}typeof a=="object"&&(c=a,a=b),c=c||{};var d=f.ajaxSetup({},c),e=d.context||d,g=e!==d&&(e.nodeType||e instanceof f)?f(e):f.event,h=f.Deferred(),i=f._Deferred(),j=d.statusCode||{},k,l={},m={},n,o,p,q,r,s=0,t,u,v={readyState:0,setRequestHeader:function(a,b){if(!s){var c=a.toLowerCase();a=m[c]=m[c]||a,l[a]=b}return this},getAllResponseHeaders:function(){return s===2?n:null},getResponseHeader:function(a){var c;if(s===2){if(!o){o={};while(c=bG.exec(n))o[c[1].toLowerCase()]=c[2]}c=o[a.toLowerCase()]}return c===b?null:c},overrideMimeType:function(a){s||(d.mimeType=a);return this},abort:function(a){a=a||"abort",p&&p.abort(a),w(0,a);return this}};h.promise(v),v.success=v.done,v.error=v.fail,v.complete=i.done,v.statusCode=function(a){if(a){var b;if(s<2)for(b in a)j[b]=[j[b],a[b]];else b=a[v.status],v.then(b,b)}return this},d.url=((a||d.url)+"").replace(bF,"").replace(bK,bV[1]+"//"),d.dataTypes=f.trim(d.dataType||"*").toLowerCase().split(bO),d.crossDomain==null&&(r=bQ.exec(d.url.toLowerCase()),d.crossDomain=!(!r||r[1]==bV[1]&&r[2]==bV[2]&&(r[3]||(r[1]==="http:"?80:443))==(bV[3]||(bV[1]==="http:"?80:443)))),d.data&&d.processData&&typeof d.data!="string"&&(d.data=f.param(d.data,d.traditional)),bY(bS,d,c,v);if(s===2)return!1;t=d.global,d.type=d.type.toUpperCase(),d.hasContent=!bJ.test(d.type),t&&f.active++===0&&f.event.trigger("ajaxStart");if(!d.hasContent){d.data&&(d.url+=(bL.test(d.url)?"&":"?")+d.data),k=d.url;if(d.cache===!1){var x=f.now(),y=d.url.replace(bP,"$1_="+x);d.url=y+(y===d.url?(bL.test(d.url)?"&":"?")+"_="+x:"")}}(d.data&&d.hasContent&&d.contentType!==!1||c.contentType)&&v.setRequestHeader("Content-Type",d.contentType),d.ifModified&&(k=k||d.url,f.lastModified[k]&&v.setRequestHeader("If-Modified-Since",f.lastModified[k]),f.etag[k]&&v.setRequestHeader("If-None-Match",f.etag[k])),v.setRequestHeader("Accept",d.dataTypes[0]&&d.accepts[d.dataTypes[0]]?d.accepts[d.dataTypes[0]]+(d.dataTypes[0]!=="*"?", */*; q=0.01":""):d.accepts["*"]);for(u in d.headers)v.setRequestHeader(u,d.headers[u]);if(d.beforeSend&&(d.beforeSend.call(e,v,d)===!1||s===2)){v.abort();return!1}for(u in{success:1,error:1,complete:1})v[u](d[u]);p=bY(bT,d,c,v);if(!p)w(-1,"No Transport");else{v.readyState=1,t&&g.trigger("ajaxSend",[v,d]),d.async&&d.timeout>0&&(q=setTimeout(function(){v.abort("timeout")},d.timeout));try{s=1,p.send(l,w)}catch(z){status<2?w(-1,z):f.error(z)}}return v},param:function(a,c){var d=[],e=function(a,b){b=f.isFunction(b)?b():b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};c===b&&(c=f.ajaxSettings.traditional);if(f.isArray(a)||a.jquery&&!f.isPlainObject(a))f.each(a,function(){e(this.name,this.value)});else for(var g in a)bZ(g,a[g],c,e);return d.join("&").replace(bC,"+")}}),f.extend({active:0,lastModified:{},etag:{}});var ca=f.now(),cb=/(\=)\?(&|$)|\?\?/i;f.ajaxSetup({jsonp:"callback",jsonpCallback:function(){return f.expando+"_"+ca++}}),f.ajaxPrefilter("json jsonp",function(b,c,d){var e=b.contentType==="application/x-www-form-urlencoded"&&typeof b.data=="string";if(b.dataTypes[0]==="jsonp"||b.jsonp!==!1&&(cb.test(b.url)||e&&cb.test(b.data))){var g,h=b.jsonpCallback=f.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,i=a[h],j=b.url,k=b.data,l="$1"+h+"$2";b.jsonp!==!1&&(j=j.replace(cb,l),b.url===j&&(e&&(k=k.replace(cb,l)),b.data===k&&(j+=(/\?/.test(j)?"&":"?")+b.jsonp+"="+h))),b.url=j,b.data=k,a[h]=function(a){g=[a]},d.always(function(){a[h]=i,g&&f.isFunction(i)&&a[h](g[0])}),b.converters["script json"]=function(){g||f.error(h+" was not called");return g[0]},b.dataTypes[0]="json";return"script"}}),f.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/javascript|ecmascript/},converters:{"text script":function(a){f.globalEval(a);return a}}}),f.ajaxPrefilter("script",function(a){a.cache===b&&(a.cache=!1),a.crossDomain&&(a.type="GET",a.global=!1)}),f.ajaxTransport("script",function(a){if(a.crossDomain){var d,e=c.head||c.getElementsByTagName("head")[0]||c.documentElement;return{send:function(f,g){d=c.createElement("script"),d.async="async",a.scriptCharset&&(d.charset=a.scriptCharset),d.src=a.url,d.onload=d.onreadystatechange=function(a,c){if(c||!d.readyState||/loaded|complete/.test(d.readyState))d.onload=d.onreadystatechange=null,e&&d.parentNode&&e.removeChild(d),d=b,c||g(200,"success")},e.insertBefore(d,e.firstChild)},abort:function(){d&&d.onload(0,1)}}}});var cc=a.ActiveXObject?function(){for(var a in ce)ce[a](0,1)}:!1,cd=0,ce;f.ajaxSettings.xhr=a.ActiveXObject?function(){return!this.isLocal&&cf()||cg()}:cf,function(a){f.extend(f.support,{ajax:!!a,cors:!!a&&"withCredentials"in a})}(f.ajaxSettings.xhr()),f.support.ajax&&f.ajaxTransport(function(c){if(!c.crossDomain||f.support.cors){var d;return{send:function(e,g){var h=c.xhr(),i,j;c.username?h.open(c.type,c.url,c.async,c.username,c.password):h.open(c.type,c.url,c.async);if(c.xhrFields)for(j in c.xhrFields)h[j]=c.xhrFields[j];c.mimeType&&h.overrideMimeType&&h.overrideMimeType(c.mimeType),!c.crossDomain&&!e["X-Requested-With"]&&(e["X-Requested-With"]="XMLHttpRequest");try{for(j in e)h.setRequestHeader(j,e[j])}catch(k){}h.send(c.hasContent&&c.data||null),d=function(a,e){var j,k,l,m,n;try{if(d&&(e||h.readyState===4)){d=b,i&&(h.onreadystatechange=f.noop,cc&&delete ce[i]);if(e)h.readyState!==4&&h.abort();else{j=h.status,l=h.getAllResponseHeaders(),m={},n=h.responseXML,n&&n.documentElement&&(m.xml=n),m.text=h.responseText;try{k=h.statusText}catch(o){k=""}!j&&c.isLocal&&!c.crossDomain?j=m.text?200:404:j===1223&&(j=204)}}}catch(p){e||g(-1,p)}m&&g(j,k,m,l)},!c.async||h.readyState===4?d():(i=++cd,cc&&(ce||(ce={},f(a).unload(cc)),ce[i]=d),h.onreadystatechange=d)},abort:function(){d&&d(0,1)}}}});var ch={},ci,cj,ck=/^(?:toggle|show|hide)$/,cl=/^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,cm,cn=[["height","marginTop","marginBottom","paddingTop","paddingBottom"],["width","marginLeft","marginRight","paddingLeft","paddingRight"],["opacity"]],co,cp=a.webkitRequestAnimationFrame||a.mozRequestAnimationFrame||a.oRequestAnimationFrame;f.fn.extend({show:function(a,b,c){var d,e;if(a||a===0)return this.animate(cs("show",3),a,b,c);for(var g=0,h=this.length;g<h;g++)d=this[g],d.style&&(e=d.style.display,!f._data(d,"olddisplay")&&e==="none"&&(e=d.style.display=""),e===""&&f.css(d,"display")==="none"&&f._data(d,"olddisplay",ct(d.nodeName)));for(g=0;g<h;g++){d=this[g];if(d.style){e=d.style.display;if(e===""||e==="none")d.style.display=f._data(d,"olddisplay")||""}}return this},hide:function(a,b,c){if(a||a===0)return this.animate(cs("hide",3),a,b,c);for(var d=0,e=this.length;d<e;d++)if(this[d].style){var g=f.css(this[d],"display");g!=="none"&&!f._data(this[d],"olddisplay")&&f._data(this[d],"olddisplay",g)}for(d=0;d<e;d++)this[d].style&&(this[d].style.display="none");return this},_toggle:f.fn.toggle,toggle:function(a,b,c){var d=typeof a=="boolean";f.isFunction(a)&&f.isFunction(b)?this._toggle.apply(this,arguments):a==null||d?this.each(function(){var b=d?a:f(this).is(":hidden");f(this)[b?"show":"hide"]()}):this.animate(cs("toggle",3),a,b,c);return this},fadeTo:function(a,b,c,d){return this.filter(":hidden").css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){var e=f.speed(b,c,d);if(f.isEmptyObject(a))return this.each(e.complete,[!1]);return this[e.queue===!1?"each":"queue"](function(){e.queue===!1&&f._mark(this);var b=f.extend({},e),c=this.nodeType===1,d=c&&f(this).is(":hidden"),g,h,i,j,k,l,m,n,o;b.animatedProperties={};for(i in a){g=f.camelCase(i),i!==g&&(a[g]=a[i],delete a[i]),h=a[g];if(h==="hide"&&d||h==="show"&&!d)return b.complete.call(this);c&&(g==="height"||g==="width")&&(b.overflow=[this.style.overflow,this.style.overflowX,this.style.overflowY],f.css(this,"display")==="inline"&&f.css(this,"float")==="none"&&(f.support.inlineBlockNeedsLayout?(j=ct(this.nodeName),j==="inline"?this.style.display="inline-block":(this.style.display="inline",this.style.zoom=1)):this.style.display="inline-block")),b.animatedProperties[g]=f.isArray(h)?h[1]:b.specialEasing&&b.specialEasing[g]||b.easing||"swing"}b.overflow!=null&&(this.style.overflow="hidden");for(i in a)k=new f.fx(this,b,i),h=a[i],ck.test(h)?k[h==="toggle"?d?"show":"hide":h]():(l=cl.exec(h),m=k.cur(),l?(n=parseFloat(l[2]),o=l[3]||(f.cssNumber[g]?"":"px"),o!=="px"&&(f.style(this,i,(n||1)+o),m=(n||1)/k.cur()*m,f.style(this,i,m+o)),l[1]&&(n=(l[1]==="-="?-1:1)*n+m),k.custom(m,n,o)):k.custom(m,h,""));return!0})},stop:function(a,b){a&&this.queue([]),this.each(function(){var a=f.timers,c=a.length;b||f._unmark(!0,this);while(c--)a[c].elem===this&&(b&&a[c](!0),a.splice(c,1))}),b||this.dequeue();return this}}),f.each({slideDown:cs("show",1),slideUp:cs("hide",1),slideToggle:cs("toggle",1),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){f.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),f.extend({speed:function(a,b,c){var d=a&&typeof a=="object"?f.extend({},a):{complete:c||!c&&b||f.isFunction(a)&&a,duration:a,easing:c&&b||b&&!f.isFunction(b)&&b};d.duration=f.fx.off?0:typeof d.duration=="number"?d.duration:d.duration in f.fx.speeds?f.fx.speeds[d.duration]:f.fx.speeds._default,d.old=d.complete,d.complete=function(a){d.queue!==!1?f.dequeue(this):a!==!1&&f._unmark(this),f.isFunction(d.old)&&d.old.call(this)};return d},easing:{linear:function(a,b,c,d){return c+d*a},swing:function(a,b,c,d){return(-Math.cos(a*Math.PI)/2+.5)*d+c}},timers:[],fx:function(a,b,c){this.options=b,this.elem=a,this.prop=c,b.orig=b.orig||{}}}),f.fx.prototype={update:function(){this.options.step&&this.options.step.call(this.elem,this.now,this),(f.fx.step[this.prop]||f.fx.step._default)(this)},cur:function(){if(this.elem[this.prop]!=null&&(!this.elem.style||this.elem.style[this.prop]==null))return this.elem[this.prop];var a,b=f.css(this.elem,this.prop);return isNaN(a=parseFloat(b))?!b||b==="auto"?0:b:a},custom:function(a,b,c){function h(a){return d.step(a)}var d=this,e=f.fx,g;this.startTime=co||cq(),this.start=a,this.end=b,this.unit=c||this.unit||(f.cssNumber[this.prop]?"":"px"),this.now=this.start,this.pos=this.state=0,h.elem=this.elem,h()&&f.timers.push(h)&&!cm&&(cp?(cm=1,g=function(){cm&&(cp(g),e.tick())},cp(g)):cm=setInterval(e.tick,e.interval))},show:function(){this.options.orig[this.prop]=f.style(this.elem,this.prop),this.options.show=!0,this.custom(this.prop==="width"||this.prop==="height"?1:0,this.cur()),f(this.elem).show()},hide:function(){this.options.orig[this.prop]=f.style(this.elem,this.prop),this.options.hide=!0,this.custom(this.cur(),0)},step:function(a){var b=co||cq(),c=!0,d=this.elem,e=this.options,g,h;if(a||b>=e.duration+this.startTime){this.now=this.end,this.pos=this.state=1,this.update(),e.animatedProperties[this.prop]=!0;for(g in e.animatedProperties)e.animatedProperties[g]!==!0&&(c=!1);if(c){e.overflow!=null&&!f.support.shrinkWrapBlocks&&f.each(["","X","Y"],function(a,b){d.style["overflow"+b]=e.overflow[a]}),e.hide&&f(d).hide();if(e.hide||e.show)for(var i in e.animatedProperties)f.style(d,i,e.orig[i]);e.complete.call(d)}return!1}e.duration==Infinity?this.now=b:(h=b-this.startTime,this.state=h/e.duration,this.pos=f.easing[e.animatedProperties[this.prop]](this.state,h,0,1,e.duration),this.now=this.start+(this.end-this.start)*this.pos),this.update();return!0}},f.extend(f.fx,{tick:function(){var a=f.timers,b=a.length;while(b--)a[b]()||a.splice(b,1);a.length||f.fx.stop()},interval:13,stop:function(){clearInterval(cm),cm=null},speeds:{slow:600,fast:200,_default:400},step:{opacity:function(a){f.style(a.elem,"opacity",a.now)},_default:function(a){a.elem.style&&a.elem.style[a.prop]!=null?a.elem.style[a.prop]=(a.prop==="width"||a.prop==="height"?Math.max(0,a.now):a.now)+a.unit:a.elem[a.prop]=a.now}}}),f.expr&&f.expr.filters&&(f.expr.filters.animated=function(a){return f.grep(f.timers,function(b){return a===b.elem}).length});var cu=/^t(?:able|d|h)$/i,cv=/^(?:body|html)$/i;"getBoundingClientRect"in c.documentElement?f.fn.offset=function(a){var b=this[0],c;if(a)return this.each(function(b){f.offset.setOffset(this,a,b)});if(!b||!b.ownerDocument)return null;if(b===b.ownerDocument.body)return f.offset.bodyOffset(b);try{c=b.getBoundingClientRect()}catch(d){}var e=b.ownerDocument,g=e.documentElement;if(!c||!f.contains(g,b))return c?{top:c.top,left:c.left}:{top:0,left:0};var h=e.body,i=cw(e),j=g.clientTop||h.clientTop||0,k=g.clientLeft||h.clientLeft||0,l=i.pageYOffset||f.support.boxModel&&g.scrollTop||h.scrollTop,m=i.pageXOffset||f.support.boxModel&&g.scrollLeft||h.scrollLeft,n=c.top+l-j,o=c.left+m-k;return{top:n,left:o}}:f.fn.offset=function(a){var b=this[0];if(a)return this.each(function(b){f.offset.setOffset(this,a,b)});if(!b||!b.ownerDocument)return null;if(b===b.ownerDocument.body)return f.offset.bodyOffset(b);f.offset.initialize();var c,d=b.offsetParent,e=b,g=b.ownerDocument,h=g.documentElement,i=g.body,j=g.defaultView,k=j?j.getComputedStyle(b,null):b.currentStyle,l=b.offsetTop,m=b.offsetLeft;while((b=b.parentNode)&&b!==i&&b!==h){if(f.offset.supportsFixedPosition&&k.position==="fixed")break;c=j?j.getComputedStyle(b,null):b.currentStyle,l-=b.scrollTop,m-=b.scrollLeft,b===d&&(l+=b.offsetTop,m+=b.offsetLeft,f.offset.doesNotAddBorder&&(!f.offset.doesAddBorderForTableAndCells||!cu.test(b.nodeName))&&(l+=parseFloat(c.borderTopWidth)||0,m+=parseFloat(c.borderLeftWidth)||0),e=d,d=b.offsetParent),f.offset.subtractsBorderForOverflowNotVisible&&c.overflow!=="visible"&&(l+=parseFloat(c.borderTopWidth)||0,m+=parseFloat(c.borderLeftWidth)||0),k=c}if(k.position==="relative"||k.position==="static")l+=i.offsetTop,m+=i.offsetLeft;f.offset.supportsFixedPosition&&k.position==="fixed"&&(l+=Math.max(h.scrollTop,i.scrollTop),m+=Math.max(h.scrollLeft,i.scrollLeft));return{top:l,left:m}},f.offset={initialize:function(){var a=c.body,b=c.createElement("div"),d,e,g,h,i=parseFloat(f.css(a,"marginTop"))||0,j="<div style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'><div></div></div><table style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";f.extend(b.style,{position:"absolute",top:0,left:0,margin:0,border:0,width:"1px",height:"1px",visibility:"hidden"}),b.innerHTML=j,a.insertBefore(b,a.firstChild),d=b.firstChild,e=d.firstChild,h=d.nextSibling.firstChild.firstChild,this.doesNotAddBorder=e.offsetTop!==5,this.doesAddBorderForTableAndCells=h.offsetTop===5,e.style.position="fixed",e.style.top="20px",this.supportsFixedPosition=e.offsetTop===20||e.offsetTop===15,e.style.position=e.style.top="",d.style.overflow="hidden",d.style.position="relative",this.subtractsBorderForOverflowNotVisible=e.offsetTop===-5,this.doesNotIncludeMarginInBodyOffset=a.offsetTop!==i,a.removeChild(b),f.offset.initialize=f.noop},bodyOffset:function(a){var b=a.offsetTop,c=a.offsetLeft;f.offset.initialize(),f.offset.doesNotIncludeMarginInBodyOffset&&(b+=parseFloat(f.css(a,"marginTop"))||0,c+=parseFloat(f.css(a,"marginLeft"))||0);return{top:b,left:c}},setOffset:function(a,b,c){var d=f.css(a,"position");d==="static"&&(a.style.position="relative");var e=f(a),g=e.offset(),h=f.css(a,"top"),i=f.css(a,"left"),j=(d==="absolute"||d==="fixed")&&f.inArray("auto",[h,i])>-1,k={},l={},m,n;j?(l=e.position(),m=l.top,n=l.left):(m=parseFloat(h)||0,n=parseFloat(i)||0),f.isFunction(b)&&(b=b.call(a,c,g)),b.top!=null&&(k.top=b.top-g.top+m),b.left!=null&&(k.left=b.left-g.left+n),"using"in b?b.using.call(a,k):e.css(k)}},f.fn.extend({position:function(){if(!this[0])return null;var a=this[0],b=this.offsetParent(),c=this.offset(),d=cv.test(b[0].nodeName)?{top:0,left:0}:b.offset();c.top-=parseFloat(f.css(a,"marginTop"))||0,c.left-=parseFloat(f.css(a,"marginLeft"))||0,d.top+=parseFloat(f.css(b[0],"borderTopWidth"))||0,d.left+=parseFloat(f.css(b[0],"borderLeftWidth"))||0;return{top:c.top-d.top,left:c.left-d.left}},offsetParent:function(){return this.map(function(){var a=this.offsetParent||c.body;while(a&&!cv.test(a.nodeName)&&f.css(a,"position")==="static")a=a.offsetParent;return a})}}),f.each(["Left","Top"],function(a,c){var d="scroll"+c;f.fn[d]=function(c){var e,g;if(c===b){e=this[0];if(!e)return null;g=cw(e);return g?"pageXOffset"in g?g[a?"pageYOffset":"pageXOffset"]:f.support.boxModel&&g.document.documentElement[d]||g.document.body[d]:e[d]}return this.each(function(){g=cw(this),g?g.scrollTo(a?f(g).scrollLeft():c,a?c:f(g).scrollTop()):this[d]=c})}}),f.each(["Height","Width"],function(a,c){var d=c.toLowerCase();f.fn["inner"+c]=function(){return this[0]?parseFloat(f.css(this[0],d,"padding")):null},f.fn["outer"+c]=function(a){return this[0]?parseFloat(f.css(this[0],d,a?"margin":"border")):null},f.fn[d]=function(a){var e=this[0];if(!e)return a==null?null:this;if(f.isFunction(a))return this.each(function(b){var c=f(this);c[d](a.call(this,b,c[d]()))});if(f.isWindow(e)){var g=e.document.documentElement["client"+c];return e.document.compatMode==="CSS1Compat"&&g||e.document.body["client"+c]||g}if(e.nodeType===9)return Math.max(e.documentElement["client"+c],e.body["scroll"+c],e.documentElement["scroll"+c],e.body["offset"+c],e.documentElement["offset"+c]);if(a===b){var h=f.css(e,d),i=parseFloat(h);return f.isNaN(i)?h:i}return this.css(d,typeof a=="string"?a:a+"px")}}),a.jQuery=a.$=f})(window);
// Underscore.js 1.1.6
// (c) 2011 Jeremy Ashkenas, DocumentCloud Inc.
// Underscore is freely distributable under the MIT license.
// Portions of Underscore are inspired or borrowed from Prototype,
// Oliver Steele's Functional, and John Resig's Micro-Templating.
// For all details and documentation:
// http://documentcloud.github.com/underscore
(function(){var p=this,C=p._,m={},i=Array.prototype,n=Object.prototype,f=i.slice,D=i.unshift,E=n.toString,l=n.hasOwnProperty,s=i.forEach,t=i.map,u=i.reduce,v=i.reduceRight,w=i.filter,x=i.every,y=i.some,o=i.indexOf,z=i.lastIndexOf;n=Array.isArray;var F=Object.keys,q=Function.prototype.bind,b=function(a){return new j(a)};typeof module!=="undefined"&&module.exports?(module.exports=b,b._=b):p._=b;b.VERSION="1.1.6";var h=b.each=b.forEach=function(a,c,d){if(a!=null)if(s&&a.forEach===s)a.forEach(c,d);else if(b.isNumber(a.length))for(var e=
0,k=a.length;e<k;e++){if(c.call(d,a[e],e,a)===m)break}else for(e in a)if(l.call(a,e)&&c.call(d,a[e],e,a)===m)break};b.map=function(a,c,b){var e=[];if(a==null)return e;if(t&&a.map===t)return a.map(c,b);h(a,function(a,g,G){e[e.length]=c.call(b,a,g,G)});return e};b.reduce=b.foldl=b.inject=function(a,c,d,e){var k=d!==void 0;a==null&&(a=[]);if(u&&a.reduce===u)return e&&(c=b.bind(c,e)),k?a.reduce(c,d):a.reduce(c);h(a,function(a,b,f){!k&&b===0?(d=a,k=!0):d=c.call(e,d,a,b,f)});if(!k)throw new TypeError("Reduce of empty array with no initial value");
return d};b.reduceRight=b.foldr=function(a,c,d,e){a==null&&(a=[]);if(v&&a.reduceRight===v)return e&&(c=b.bind(c,e)),d!==void 0?a.reduceRight(c,d):a.reduceRight(c);a=(b.isArray(a)?a.slice():b.toArray(a)).reverse();return b.reduce(a,c,d,e)};b.find=b.detect=function(a,c,b){var e;A(a,function(a,g,f){if(c.call(b,a,g,f))return e=a,!0});return e};b.filter=b.select=function(a,c,b){var e=[];if(a==null)return e;if(w&&a.filter===w)return a.filter(c,b);h(a,function(a,g,f){c.call(b,a,g,f)&&(e[e.length]=a)});return e};
b.reject=function(a,c,b){var e=[];if(a==null)return e;h(a,function(a,g,f){c.call(b,a,g,f)||(e[e.length]=a)});return e};b.every=b.all=function(a,c,b){var e=!0;if(a==null)return e;if(x&&a.every===x)return a.every(c,b);h(a,function(a,g,f){if(!(e=e&&c.call(b,a,g,f)))return m});return e};var A=b.some=b.any=function(a,c,d){c||(c=b.identity);var e=!1;if(a==null)return e;if(y&&a.some===y)return a.some(c,d);h(a,function(a,b,f){if(e=c.call(d,a,b,f))return m});return e};b.include=b.contains=function(a,c){var b=
!1;if(a==null)return b;if(o&&a.indexOf===o)return a.indexOf(c)!=-1;A(a,function(a){if(b=a===c)return!0});return b};b.invoke=function(a,c){var d=f.call(arguments,2);return b.map(a,function(a){return(c.call?c||a:a[c]).apply(a,d)})};b.pluck=function(a,c){return b.map(a,function(a){return a[c]})};b.max=function(a,c,d){if(!c&&b.isArray(a))return Math.max.apply(Math,a);var e={computed:-Infinity};h(a,function(a,b,f){b=c?c.call(d,a,b,f):a;b>=e.computed&&(e={value:a,computed:b})});return e.value};b.min=function(a,
c,d){if(!c&&b.isArray(a))return Math.min.apply(Math,a);var e={computed:Infinity};h(a,function(a,b,f){b=c?c.call(d,a,b,f):a;b<e.computed&&(e={value:a,computed:b})});return e.value};b.sortBy=function(a,c,d){return b.pluck(b.map(a,function(a,b,f){return{value:a,criteria:c.call(d,a,b,f)}}).sort(function(a,b){var c=a.criteria,d=b.criteria;return c<d?-1:c>d?1:0}),"value")};b.sortedIndex=function(a,c,d){d||(d=b.identity);for(var e=0,f=a.length;e<f;){var g=e+f>>1;d(a[g])<d(c)?e=g+1:f=g}return e};b.toArray=
function(a){if(!a)return[];if(a.toArray)return a.toArray();if(b.isArray(a))return a;if(b.isArguments(a))return f.call(a);return b.values(a)};b.size=function(a){return b.toArray(a).length};b.first=b.head=function(a,b,d){return b!=null&&!d?f.call(a,0,b):a[0]};b.rest=b.tail=function(a,b,d){return f.call(a,b==null||d?1:b)};b.last=function(a){return a[a.length-1]};b.compact=function(a){return b.filter(a,function(a){return!!a})};b.flatten=function(a){return b.reduce(a,function(a,d){if(b.isArray(d))return a.concat(b.flatten(d));
a[a.length]=d;return a},[])};b.without=function(a){var c=f.call(arguments,1);return b.filter(a,function(a){return!b.include(c,a)})};b.uniq=b.unique=function(a,c){return b.reduce(a,function(a,e,f){if(0==f||(c===!0?b.last(a)!=e:!b.include(a,e)))a[a.length]=e;return a},[])};b.intersect=function(a){var c=f.call(arguments,1);return b.filter(b.uniq(a),function(a){return b.every(c,function(c){return b.indexOf(c,a)>=0})})};b.zip=function(){for(var a=f.call(arguments),c=b.max(b.pluck(a,"length")),d=Array(c),
e=0;e<c;e++)d[e]=b.pluck(a,""+e);return d};b.indexOf=function(a,c,d){if(a==null)return-1;var e;if(d)return d=b.sortedIndex(a,c),a[d]===c?d:-1;if(o&&a.indexOf===o)return a.indexOf(c);d=0;for(e=a.length;d<e;d++)if(a[d]===c)return d;return-1};b.lastIndexOf=function(a,b){if(a==null)return-1;if(z&&a.lastIndexOf===z)return a.lastIndexOf(b);for(var d=a.length;d--;)if(a[d]===b)return d;return-1};b.range=function(a,b,d){arguments.length<=1&&(b=a||0,a=0);d=arguments[2]||1;for(var e=Math.max(Math.ceil((b-a)/
d),0),f=0,g=Array(e);f<e;)g[f++]=a,a+=d;return g};b.bind=function(a,b){if(a.bind===q&&q)return q.apply(a,f.call(arguments,1));var d=f.call(arguments,2);return function(){return a.apply(b,d.concat(f.call(arguments)))}};b.bindAll=function(a){var c=f.call(arguments,1);c.length==0&&(c=b.functions(a));h(c,function(c){a[c]=b.bind(a[c],a)});return a};b.memoize=function(a,c){var d={};c||(c=b.identity);return function(){var b=c.apply(this,arguments);return l.call(d,b)?d[b]:d[b]=a.apply(this,arguments)}};b.delay=
function(a,b){var d=f.call(arguments,2);return setTimeout(function(){return a.apply(a,d)},b)};b.defer=function(a){return b.delay.apply(b,[a,1].concat(f.call(arguments,1)))};var B=function(a,b,d){var e;return function(){var f=this,g=arguments,h=function(){e=null;a.apply(f,g)};d&&clearTimeout(e);if(d||!e)e=setTimeout(h,b)}};b.throttle=function(a,b){return B(a,b,!1)};b.debounce=function(a,b){return B(a,b,!0)};b.once=function(a){var b=!1,d;return function(){if(b)return d;b=!0;return d=a.apply(this,arguments)}};
b.wrap=function(a,b){return function(){var d=[a].concat(f.call(arguments));return b.apply(this,d)}};b.compose=function(){var a=f.call(arguments);return function(){for(var b=f.call(arguments),d=a.length-1;d>=0;d--)b=[a[d].apply(this,b)];return b[0]}};b.after=function(a,b){return function(){if(--a<1)return b.apply(this,arguments)}};b.keys=F||function(a){if(a!==Object(a))throw new TypeError("Invalid object");var b=[],d;for(d in a)l.call(a,d)&&(b[b.length]=d);return b};b.values=function(a){return b.map(a,
b.identity)};b.functions=b.methods=function(a){return b.filter(b.keys(a),function(c){return b.isFunction(a[c])}).sort()};b.extend=function(a){h(f.call(arguments,1),function(b){for(var d in b)b[d]!==void 0&&(a[d]=b[d])});return a};b.defaults=function(a){h(f.call(arguments,1),function(b){for(var d in b)a[d]==null&&(a[d]=b[d])});return a};b.clone=function(a){return b.isArray(a)?a.slice():b.extend({},a)};b.tap=function(a,b){b(a);return a};b.isEqual=function(a,c){if(a===c)return!0;var d=typeof a;if(d!=
typeof c)return!1;if(a==c)return!0;if(!a&&c||a&&!c)return!1;if(a._chain)a=a._wrapped;if(c._chain)c=c._wrapped;if(a.isEqual)return a.isEqual(c);if(b.isDate(a)&&b.isDate(c))return a.getTime()===c.getTime();if(b.isNaN(a)&&b.isNaN(c))return!1;if(b.isRegExp(a)&&b.isRegExp(c))return a.source===c.source&&a.global===c.global&&a.ignoreCase===c.ignoreCase&&a.multiline===c.multiline;if(d!=="object")return!1;if(a.length&&a.length!==c.length)return!1;d=b.keys(a);var e=b.keys(c);if(d.length!=e.length)return!1;
for(var f in a)if(!(f in c)||!b.isEqual(a[f],c[f]))return!1;return!0};b.isEmpty=function(a){if(b.isArray(a)||b.isString(a))return a.length===0;for(var c in a)if(l.call(a,c))return!1;return!0};b.isElement=function(a){return!!(a&&a.nodeType==1)};b.isArray=n||function(a){return E.call(a)==="[object Array]"};b.isArguments=function(a){return!(!a||!l.call(a,"callee"))};b.isFunction=function(a){return!(!a||!a.constructor||!a.call||!a.apply)};b.isString=function(a){return!!(a===""||a&&a.charCodeAt&&a.substr)};
b.isNumber=function(a){return!!(a===0||a&&a.toExponential&&a.toFixed)};b.isNaN=function(a){return a!==a};b.isBoolean=function(a){return a===!0||a===!1};b.isDate=function(a){return!(!a||!a.getTimezoneOffset||!a.setUTCFullYear)};b.isRegExp=function(a){return!(!a||!a.test||!a.exec||!(a.ignoreCase||a.ignoreCase===!1))};b.isNull=function(a){return a===null};b.isUndefined=function(a){return a===void 0};b.noConflict=function(){p._=C;return this};b.identity=function(a){return a};b.times=function(a,b,d){for(var e=
0;e<a;e++)b.call(d,e)};b.mixin=function(a){h(b.functions(a),function(c){H(c,b[c]=a[c])})};var I=0;b.uniqueId=function(a){var b=I++;return a?a+b:b};b.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g};b.template=function(a,c){var d=b.templateSettings;d="var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('"+a.replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(d.interpolate,function(a,b){return"',"+b.replace(/\\'/g,"'")+",'"}).replace(d.evaluate||
null,function(a,b){return"');"+b.replace(/\\'/g,"'").replace(/[\r\n\t]/g," ")+"__p.push('"}).replace(/\r/g,"\\r").replace(/\n/g,"\\n").replace(/\t/g,"\\t")+"');}return __p.join('');";d=new Function("obj",d);return c?d(c):d};var j=function(a){this._wrapped=a};b.prototype=j.prototype;var r=function(a,c){return c?b(a).chain():a},H=function(a,c){j.prototype[a]=function(){var a=f.call(arguments);D.call(a,this._wrapped);return r(c.apply(b,a),this._chain)}};b.mixin(b);h(["pop","push","reverse","shift","sort",
"splice","unshift"],function(a){var b=i[a];j.prototype[a]=function(){b.apply(this._wrapped,arguments);return r(this._wrapped,this._chain)}});h(["concat","join","slice"],function(a){var b=i[a];j.prototype[a]=function(){return r(b.apply(this._wrapped,arguments),this._chain)}});j.prototype.chain=function(){this._chain=!0;return this};j.prototype.value=function(){return this._wrapped}})();
// Backbone.js 0.5.1
// (c) 2010 Jeremy Ashkenas, DocumentCloud Inc.
// Backbone may be freely distributed under the MIT license.
// For all details and documentation:
// http://documentcloud.github.com/backbone
(function(){var h=this,p=h.Backbone,e;e=typeof exports!=="undefined"?exports:h.Backbone={};e.VERSION="0.5.1";var f=h._;if(!f&&typeof require!=="undefined")f=require("underscore")._;var g=h.jQuery||h.Zepto;e.noConflict=function(){h.Backbone=p;return this};e.emulateHTTP=!1;e.emulateJSON=!1;e.Events={bind:function(a,b){var c=this._callbacks||(this._callbacks={});(c[a]||(c[a]=[])).push(b);return this},unbind:function(a,b){var c;if(a){if(c=this._callbacks)if(b){c=c[a];if(!c)return this;for(var d=0,e=c.length;d<
e;d++)if(b===c[d]){c[d]=null;break}}else c[a]=[]}else this._callbacks={};return this},trigger:function(a){var b,c,d,e,f=2;if(!(c=this._callbacks))return this;for(;f--;)if(b=f?a:"all",b=c[b])for(var g=0,h=b.length;g<h;g++)(d=b[g])?(e=f?Array.prototype.slice.call(arguments,1):arguments,d.apply(this,e)):(b.splice(g,1),g--,h--);return this}};e.Model=function(a,b){var c;a||(a={});if(c=this.defaults)f.isFunction(c)&&(c=c()),a=f.extend({},c,a);this.attributes={};this._escapedAttributes={};this.cid=f.uniqueId("c");
this.set(a,{silent:!0});this._changed=!1;this._previousAttributes=f.clone(this.attributes);if(b&&b.collection)this.collection=b.collection;this.initialize(a,b)};f.extend(e.Model.prototype,e.Events,{_previousAttributes:null,_changed:!1,idAttribute:"id",initialize:function(){},toJSON:function(){return f.clone(this.attributes)},get:function(a){return this.attributes[a]},escape:function(a){var b;if(b=this._escapedAttributes[a])return b;b=this.attributes[a];return this._escapedAttributes[a]=(b==null?"":
""+b).replace(/&(?!\w+;|#\d+;|#x[\da-f]+;)/gi,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27").replace(/\//g,"&#x2F;")},has:function(a){return this.attributes[a]!=null},set:function(a,b){b||(b={});if(!a)return this;if(a.attributes)a=a.attributes;var c=this.attributes,d=this._escapedAttributes;if(!b.silent&&this.validate&&!this._performValidation(a,b))return!1;if(this.idAttribute in a)this.id=a[this.idAttribute];var e=this._changing;this._changing=!0;
for(var g in a){var h=a[g];if(!f.isEqual(c[g],h))c[g]=h,delete d[g],this._changed=!0,b.silent||this.trigger("change:"+g,this,h,b)}!e&&!b.silent&&this._changed&&this.change(b);this._changing=!1;return this},unset:function(a,b){if(!(a in this.attributes))return this;b||(b={});var c={};c[a]=void 0;if(!b.silent&&this.validate&&!this._performValidation(c,b))return!1;delete this.attributes[a];delete this._escapedAttributes[a];a==this.idAttribute&&delete this.id;this._changed=!0;b.silent||(this.trigger("change:"+
a,this,void 0,b),this.change(b));return this},clear:function(a){a||(a={});var b,c=this.attributes,d={};for(b in c)d[b]=void 0;if(!a.silent&&this.validate&&!this._performValidation(d,a))return!1;this.attributes={};this._escapedAttributes={};this._changed=!0;if(!a.silent){for(b in c)this.trigger("change:"+b,this,void 0,a);this.change(a)}return this},fetch:function(a){a||(a={});var b=this,c=a.success;a.success=function(d,e,f){if(!b.set(b.parse(d,f),a))return!1;c&&c(b,d)};a.error=i(a.error,b,a);return(this.sync||
e.sync).call(this,"read",this,a)},save:function(a,b){b||(b={});if(a&&!this.set(a,b))return!1;var c=this,d=b.success;b.success=function(a,e,f){if(!c.set(c.parse(a,f),b))return!1;d&&d(c,a,f)};b.error=i(b.error,c,b);var f=this.isNew()?"create":"update";return(this.sync||e.sync).call(this,f,this,b)},destroy:function(a){a||(a={});if(this.isNew())return this.trigger("destroy",this,this.collection,a);var b=this,c=a.success;a.success=function(d){b.trigger("destroy",b,b.collection,a);c&&c(b,d)};a.error=i(a.error,
b,a);return(this.sync||e.sync).call(this,"delete",this,a)},url:function(){var a=k(this.collection)||this.urlRoot||l();if(this.isNew())return a;return a+(a.charAt(a.length-1)=="/"?"":"/")+encodeURIComponent(this.id)},parse:function(a){return a},clone:function(){return new this.constructor(this)},isNew:function(){return this.id==null},change:function(a){this.trigger("change",this,a);this._previousAttributes=f.clone(this.attributes);this._changed=!1},hasChanged:function(a){if(a)return this._previousAttributes[a]!=
this.attributes[a];return this._changed},changedAttributes:function(a){a||(a=this.attributes);var b=this._previousAttributes,c=!1,d;for(d in a)f.isEqual(b[d],a[d])||(c=c||{},c[d]=a[d]);return c},previous:function(a){if(!a||!this._previousAttributes)return null;return this._previousAttributes[a]},previousAttributes:function(){return f.clone(this._previousAttributes)},_performValidation:function(a,b){var c=this.validate(a);if(c)return b.error?b.error(this,c,b):this.trigger("error",this,c,b),!1;return!0}});
e.Collection=function(a,b){b||(b={});if(b.comparator)this.comparator=b.comparator;f.bindAll(this,"_onModelEvent","_removeReference");this._reset();a&&this.reset(a,{silent:!0});this.initialize.apply(this,arguments)};f.extend(e.Collection.prototype,e.Events,{model:e.Model,initialize:function(){},toJSON:function(){return this.map(function(a){return a.toJSON()})},add:function(a,b){if(f.isArray(a))for(var c=0,d=a.length;c<d;c++)this._add(a[c],b);else this._add(a,b);return this},remove:function(a,b){if(f.isArray(a))for(var c=
0,d=a.length;c<d;c++)this._remove(a[c],b);else this._remove(a,b);return this},get:function(a){if(a==null)return null;return this._byId[a.id!=null?a.id:a]},getByCid:function(a){return a&&this._byCid[a.cid||a]},at:function(a){return this.models[a]},sort:function(a){a||(a={});if(!this.comparator)throw Error("Cannot sort a set without a comparator");this.models=this.sortBy(this.comparator);a.silent||this.trigger("reset",this,a);return this},pluck:function(a){return f.map(this.models,function(b){return b.get(a)})},
reset:function(a,b){a||(a=[]);b||(b={});this.each(this._removeReference);this._reset();this.add(a,{silent:!0});b.silent||this.trigger("reset",this,b);return this},fetch:function(a){a||(a={});var b=this,c=a.success;a.success=function(d,f,e){b[a.add?"add":"reset"](b.parse(d,e),a);c&&c(b,d)};a.error=i(a.error,b,a);return(this.sync||e.sync).call(this,"read",this,a)},create:function(a,b){var c=this;b||(b={});a=this._prepareModel(a,b);if(!a)return!1;var d=b.success;b.success=function(a,e,f){c.add(a,b);
d&&d(a,e,f)};a.save(null,b);return a},parse:function(a){return a},chain:function(){return f(this.models).chain()},_reset:function(){this.length=0;this.models=[];this._byId={};this._byCid={}},_prepareModel:function(a,b){if(a instanceof e.Model){if(!a.collection)a.collection=this}else{var c=a;a=new this.model(c,{collection:this});a.validate&&!a._performValidation(c,b)&&(a=!1)}return a},_add:function(a,b){b||(b={});a=this._prepareModel(a,b);if(!a)return!1;var c=this.getByCid(a)||this.get(a);if(c)throw Error(["Can't add the same model to a set twice",
c.id]);this._byId[a.id]=a;this._byCid[a.cid]=a;this.models.splice(b.at!=null?b.at:this.comparator?this.sortedIndex(a,this.comparator):this.length,0,a);a.bind("all",this._onModelEvent);this.length++;b.silent||a.trigger("add",a,this,b);return a},_remove:function(a,b){b||(b={});a=this.getByCid(a)||this.get(a);if(!a)return null;delete this._byId[a.id];delete this._byCid[a.cid];this.models.splice(this.indexOf(a),1);this.length--;b.silent||a.trigger("remove",a,this,b);this._removeReference(a);return a},
_removeReference:function(a){this==a.collection&&delete a.collection;a.unbind("all",this._onModelEvent)},_onModelEvent:function(a,b,c,d){(a=="add"||a=="remove")&&c!=this||(a=="destroy"&&this._remove(b,d),b&&a==="change:"+b.idAttribute&&(delete this._byId[b.previous(b.idAttribute)],this._byId[b.id]=b),this.trigger.apply(this,arguments))}});f.each(["forEach","each","map","reduce","reduceRight","find","detect","filter","select","reject","every","all","some","any","include","contains","invoke","max",
"min","sortBy","sortedIndex","toArray","size","first","rest","last","without","indexOf","lastIndexOf","isEmpty"],function(a){e.Collection.prototype[a]=function(){return f[a].apply(f,[this.models].concat(f.toArray(arguments)))}});e.Router=function(a){a||(a={});if(a.routes)this.routes=a.routes;this._bindRoutes();this.initialize.apply(this,arguments)};var q=/:([\w\d]+)/g,r=/\*([\w\d]+)/g,s=/[-[\]{}()+?.,\\^$|#\s]/g;f.extend(e.Router.prototype,e.Events,{initialize:function(){},route:function(a,b,c){e.history||
(e.history=new e.History);f.isRegExp(a)||(a=this._routeToRegExp(a));e.history.route(a,f.bind(function(d){d=this._extractParameters(a,d);c.apply(this,d);this.trigger.apply(this,["route:"+b].concat(d))},this))},navigate:function(a,b){e.history.navigate(a,b)},_bindRoutes:function(){if(this.routes){var a=[],b;for(b in this.routes)a.unshift([b,this.routes[b]]);b=0;for(var c=a.length;b<c;b++)this.route(a[b][0],a[b][1],this[a[b][1]])}},_routeToRegExp:function(a){a=a.replace(s,"\\$&").replace(q,"([^/]*)").replace(r,
"(.*?)");return RegExp("^"+a+"$")},_extractParameters:function(a,b){return a.exec(b).slice(1)}});e.History=function(){this.handlers=[];f.bindAll(this,"checkUrl")};var j=/^#*/,t=/msie [\w.]+/,m=!1;f.extend(e.History.prototype,{interval:50,getFragment:function(a,b){if(a==null)if(this._hasPushState||b){a=window.location.pathname;var c=window.location.search;c&&(a+=c);a.indexOf(this.options.root)==0&&(a=a.substr(this.options.root.length))}else a=window.location.hash;return a.replace(j,"")},start:function(a){if(m)throw Error("Backbone.history has already been started");
this.options=f.extend({},{root:"/"},this.options,a);this._wantsPushState=!!this.options.pushState;this._hasPushState=!(!this.options.pushState||!window.history||!window.history.pushState);a=this.getFragment();var b=document.documentMode;if(b=t.exec(navigator.userAgent.toLowerCase())&&(!b||b<=7))this.iframe=g('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow,this.navigate(a);this._hasPushState?g(window).bind("popstate",this.checkUrl):"onhashchange"in window&&!b?
g(window).bind("hashchange",this.checkUrl):setInterval(this.checkUrl,this.interval);this.fragment=a;m=!0;a=window.location;b=a.pathname==this.options.root;if(this._wantsPushState&&!this._hasPushState&&!b)this.fragment=this.getFragment(null,!0),window.location.replace(this.options.root+"#"+this.fragment);else if(this._wantsPushState&&this._hasPushState&&b&&a.hash)this.fragment=a.hash.replace(j,""),window.history.replaceState({},document.title,a.protocol+"//"+a.host+this.options.root+this.fragment);
return this.loadUrl()},route:function(a,b){this.handlers.unshift({route:a,callback:b})},checkUrl:function(){var a=this.getFragment();a==this.fragment&&this.iframe&&(a=this.getFragment(this.iframe.location.hash));if(a==this.fragment||a==decodeURIComponent(this.fragment))return!1;this.iframe&&this.navigate(a);this.loadUrl()||this.loadUrl(window.location.hash)},loadUrl:function(a){var b=this.fragment=this.getFragment(a);return f.any(this.handlers,function(a){if(a.route.test(b))return a.callback(b),!0})},
navigate:function(a,b){var c=(a||"").replace(j,"");if(!(this.fragment==c||this.fragment==decodeURIComponent(c))){if(this._hasPushState){var d=window.location;c.indexOf(this.options.root)!=0&&(c=this.options.root+c);this.fragment=c;window.history.pushState({},document.title,d.protocol+"//"+d.host+c)}else if(window.location.hash=this.fragment=c,this.iframe&&c!=this.getFragment(this.iframe.location.hash))this.iframe.document.open().close(),this.iframe.location.hash=c;b&&this.loadUrl(a)}}});e.View=function(a){this.cid=
f.uniqueId("view");this._configure(a||{});this._ensureElement();this.delegateEvents();this.initialize.apply(this,arguments)};var u=/^(\S+)\s*(.*)$/,n=["model","collection","el","id","attributes","className","tagName"];f.extend(e.View.prototype,e.Events,{tagName:"div",$:function(a){return g(a,this.el)},initialize:function(){},render:function(){return this},remove:function(){g(this.el).remove();return this},make:function(a,b,c){a=document.createElement(a);b&&g(a).attr(b);c&&g(a).html(c);return a},delegateEvents:function(a){if(a||
(a=this.events))for(var b in g(this.el).unbind(".delegateEvents"+this.cid),a){var c=this[a[b]];if(!c)throw Error('Event "'+a[b]+'" does not exist');var d=b.match(u),e=d[1];d=d[2];c=f.bind(c,this);e+=".delegateEvents"+this.cid;d===""?g(this.el).bind(e,c):g(this.el).delegate(d,e,c)}},_configure:function(a){this.options&&(a=f.extend({},this.options,a));for(var b=0,c=n.length;b<c;b++){var d=n[b];a[d]&&(this[d]=a[d])}this.options=a},_ensureElement:function(){if(this.el){if(f.isString(this.el))this.el=
g(this.el).get(0)}else{var a=this.attributes||{};if(this.id)a.id=this.id;if(this.className)a["class"]=this.className;this.el=this.make(this.tagName,a)}}});e.Model.extend=e.Collection.extend=e.Router.extend=e.View.extend=function(a,b){var c=v(this,a,b);c.extend=this.extend;return c};var w={create:"POST",update:"PUT","delete":"DELETE",read:"GET"};e.sync=function(a,b,c){var d=w[a];c=f.extend({type:d,dataType:"json",processData:!1},c);if(!c.url)c.url=k(b)||l();if(!c.data&&b&&(a=="create"||a=="update"))c.contentType=
"application/json",c.data=JSON.stringify(b.toJSON());if(e.emulateJSON)c.contentType="application/x-www-form-urlencoded",c.processData=!0,c.data=c.data?{model:c.data}:{};if(e.emulateHTTP&&(d==="PUT"||d==="DELETE")){if(e.emulateJSON)c.data._method=d;c.type="POST";c.beforeSend=function(a){a.setRequestHeader("X-HTTP-Method-Override",d)}}return g.ajax(c)};var o=function(){},v=function(a,b,c){var d;d=b&&b.hasOwnProperty("constructor")?b.constructor:function(){return a.apply(this,arguments)};f.extend(d,
a);o.prototype=a.prototype;d.prototype=new o;b&&f.extend(d.prototype,b);c&&f.extend(d,c);d.prototype.constructor=d;d.__super__=a.prototype;return d},k=function(a){if(!a||!a.url)return null;return f.isFunction(a.url)?a.url():a.url},l=function(){throw Error('A "url" property or function must be specified');},i=function(a,b,c){return function(d){a?a(b,d,c):b.trigger("error",b,d,c)}}}).call(this);
/*
 The MIT License: Copyright (c) 2010 LiosK.
*/
function UUID(){}UUID.generate=function(){var a=UUID._getRandomInt,b=UUID._hexAligner;return b(a(32),8)+"-"+b(a(16),4)+"-"+b(16384|a(12),4)+"-"+b(32768|a(14),4)+"-"+b(a(48),12)};UUID._getRandomInt=function(a){if(a<0)return NaN;if(a<=30)return 0|Math.random()*(1<<a);if(a<=53)return(0|Math.random()*1073741824)+(0|Math.random()*(1<<a-30))*1073741824;return NaN};UUID._getIntAligner=function(a){return function(b,f){for(var c=b.toString(a),d=f-c.length,e="0";d>0;d>>>=1,e+=e)if(d&1)c=e+c;return c}};
UUID._hexAligner=UUID._getIntAligner(16);
// (c) 2011 Enginimation Studio (http://enginimation.com).
// porridge.js may be freely distributed under the MIT license.
"use strict";var global=this,indexedDB=global.indexedDB||global.webkitIndexedDB,IDBTransaction=global.IDBTransaction||global.webkitIDBTransaction,IDBKeyRange=global.IDBKeyRange||global.webkitIDBKeyRange,Porridge={version:"0.3",db:null,log:function(a){console.log(a)},info:function(a){console.info(a)},init:function(a,b,c){var d=indexedDB.open(a.dbName,a.dbDescription),e=a.dbVersion;d.onsuccess=function(d){var f=d.target.result;Porridge.db=f;if(e!=f.version){var g=f.setVersion(e);g.onfailure=c||Porridge.log,g.onsuccess=function(c){for(var d=0;d<a.stores.length;d++){var e=a.stores[d],g=f.createObjectStore(e.name,e.key,!0);if(e.indexes)for(var h=0;h<e.indexes.length;h++){var i=e.indexes[h];g.createIndex(i.name,i.field||i.name)}}Porridge.log("initialized db"),b()}}else b()},d.onfailure=c||this.log},all:function(a,b,c,d){var e=this.db.transaction([a],IDBTransaction.READ_WRITE,0),f=e.objectStore(a),g=f.openCursor();g.onsuccess=function(a){var d=a.result||a.target.result;if(!d)c&&c();else{var e=d.value;b(e),d.continue()}},g.onerror=d||this.log},save:function(a,b,c,d){var e=this.db.transaction([a],IDBTransaction.READ_WRITE,0),f=e.objectStore(a),g=f.put(b,c);g.onsuccess=Porridge.info,g.onerror=d||this.log},remove:function(a,b,c,d){var e=this.db.transaction([a],IDBTransaction.READ_WRITE,0),f=e.objectStore(a),g=f.delete(b);g.onsuccess=c,g.onerror=d||this.log},allByKey:function(a,b,c,d,e,f){var g=this.db.transaction([a],IDBTransaction.READ_WRITE,0),h=g.objectStore(a),i=h.index(b),j=new IDBKeyRange.only(c),k=i.openCursor(j);k.onsuccess=function(a){var b=a.result||a.target.result;if(!b)e&&e();else{var c=b.value;d(c),b.continue()}},k.onerror=f||this.log}}
// (c) 2011 Enginimation Studio (http://enginimation.com).
// backbone-indexdb.js may be freely distributed under the MIT license.
"use strict",Porridge.Model=Backbone.Model.extend({initialize:function(){this.get("id")||(this.id=UUID.generate(),this.set({id:this.id}))},save:function(){var a=this.constructor.definition.name;Porridge.save(a,this.toJSON(),this.id)},destroy:function(){var a=this.constructor.definition.name,b=this.constructor.definition.key||"id",c=this,d=function(){c.trigger("destroy",c,c.collection)};Porridge.remove(a,this.get(b),d)}},{definition:{}}),Porridge.Collection=Backbone.Collection.extend({fetch:function(a){a||(a={});var b=this,c=this.model.definition.name,d=function(a){b.add(new b.model({attributes:a}))};Porridge.all(c,d,function(){b.trigger("retrieved")},a.error)},fetchByKey:function(a,b){var c=this,d=this.model.definition.name,e=function(a){c.add(new c.model({attributes:a}))};Porridge.allByKey(d,a,b,e,function(){c.trigger("retrieved")})}})
var global=this,fs;global.requestFileSystem=global.requestFileSystem||global.webkitRequestFileSystem;global.BlobBuilder=global.BlobBuilder||global.WebKitBlobBuilder;global.resolveLocalFileSystemURL=global.resolveLocalFileSystemURL||global.webkitResolveLocalFileSystemURL;global.URL=global.URL||global.webkitURL;
fs=Object.create({},{version:{value:"0.9"},log:{value:!1,writable:!0},maxSize:{value:10695475200,writable:!0},FILE_EXPECTED:{value:50},BROWSER_NOT_SUPPORTED:{value:51},getNativeFS:{value:function(a,b){if(global.requestFileSystem){var c=global.PERSISTENT,b=b||{};if(b.tmp)c=global.TEMPORARY;global.requestFileSystem(c,this.maxSize,function(b){a(void 0,b)},function(b){a(b)})}else a(fs.BROWSER_NOT_SUPPORTED)}},createBlob:{value:function(a,b){var c=new global.BlobBuilder;c.append(a);return c.getBlob(b)}},
base64StringToBlob:{value:function(a,b){for(var c=global.atob(a),d=c.length,e=new global.Int8Array(d),f=0;f<d;f++)e[f]=c.charCodeAt(f);return this.createBlob(e.buffer,b)}}});Object.defineProperty(global.File.prototype,"shortName",{value:function(){return this.name.substring(0,this.name.lastIndexOf("."))}});Object.defineProperty(global.File.prototype,"extension",{value:function(){return this.name.substring(this.name.lastIndexOf("."))}});
Object.defineProperty(global.File.prototype,"sizeInKB",{value:function(){return(this.size/1014).toFixed(1)}});Object.defineProperty(global.File.prototype,"sizeInMB",{value:function(){return(this.size/1038336).toFixed(1)}});Object.defineProperty(global.File.prototype,"sizeInGB",{value:function(){return(this.size/1063256064).toFixed(1)}});Object.defineProperty(global.FileError.prototype,"message",{value:function(){return this.code}});
fs.io=Object.create({},{getFile:{value:function(a,b,c){a.getFile(b,{create:!0},function(b){c(void 0,b)},function(b){c(b)})}},getFileFromRoot:{value:function(a,b,c){fs.getNativeFS(function(c,e){c?b(c):fs.io.getFile(e.root,a,b)},c)}},readDirectory:{value:function(a,b){fs.util.getDirectory(a,function(a,d){a?b(a):fs.util.readEntriesFromDirectory(d,b)},{})}},readRootDirectory:{value:function(a){fs.getNativeFS(function(b,c){b?a(b):fs.util.readEntriesFromDirectory(c.root,a)},{})}},getDirectory:{value:function(a,
b,c){c(void 0,a.getDirectory(b,{create:!0}))}},getDirectoryFromRoot:{value:function(a,b,c){fs.getNativeFS(function(c,e){c?b(c):fs.util.getDirectory(e.root,a,b)},c)}}});
fs.util=Object.create({},{getReaderUsingFileName:{value:function(a,b,c,d){fs.io.getFileFromRoot(a,function(a,d){d.file(function(a){fs.util.getReader(a,b,c)},function(a){b(a)})},d)}},getReader:{value:function(a,b,c){var d=new global.FileReader;d.onloadend=function(){b(void 0,this.result,a)};d[c](a)}},readEntriesFromDirectory:{value:function(a,b){a.createReader().readEntries(function(a){b(void 0,a)},function(a){b(a)})}},readAsArrayBuffer:{value:function(a,b,c){this.getReaderUsingFileName(a,b,"readAsArrayBuffer",
c)}},readFileAsArrayBuffer:{value:function(a,b){this.getReader(a,b,"readAsArrayBuffer")}},readAsBinaryString:{value:function(a,b,c){this.getReaderUsingFileName(a,b,"readAsBinaryString",c)}},readFileAsBinaryString:{value:function(a,b){this.getReader(a,b,"readAsBinaryString")}},readAsDataUrl:{value:function(a,b,c){this.getReaderUsingFileName(a,b,"readAsDataURL",c)}},readAsText:{value:function(a,b,c){this.getReaderUsingFileName(a,b,"readAsText",c)}},remove:{value:function(a,b){fs.io.getFileFromRoot(a,
function(a,d){d.remove(function(){b(void 0)},function(a){b(a)})})}},writeBase64StrToFile:{value:function(a,b,c,d,e){b=fs.base64StringToBlob(b,c);this.writeBlobToFile(a,b,d,e)}},writeBlobToFile:{value:function(a,b,c,d){fs.io.getFileFromRoot(a,function(a,d){a?c(a):d.createWriter(function(a){a.onwriteend=function(){console.log("writing to file finished.");c(void 0)};a.onerror=function(){console.log("Error writing to file:"+this.error);c(this.error)};a.write(b)},function(a){c(a)})},d)}},writeTextToFile:{value:function(a,
b,c,d){b=fs.createBlob(b,"text/plain");fs.util.writeBlobToFile(a,b,c,d)}},writeArrayBufferToFile:{value:function(a,b,c,d,e){b=fs.createBlob(c,b);fs.util.writeBlobToFile(a,b,d,e)}},writeFileToFile:{value:function(a,b,c){fs.io.getFileFromRoot(c.filename||a.name,function(c,e){c?b(c):e.createWriter(function(c){c.onwriteend=function(){console.log("writing to file finished.");b(void 0)};c.onerror=function(){console.log("Error writing to file:"+this.error);b(this.error)};c.write(a)},function(a){b(a)})},
c)}},createFileURL:{value:function(a,b){fs.io.getFileFromRoot(a,function(a,d){a?b(a):d.file(function(a){a=global.URL.createObjectURL(a);b(void 0,a)})})}},destroyFileURL:{value:function(a){global.URL.revokeObjectURL(a)}}});
fs.read=Object.create({},{asDataUrl:{value:function(a,b){fs.util.readAsDataUrl(a,b,{})}},tmpFileAsDataUrl:{value:function(a,b){fs.util.readAsDataUrl(a,b,{tmp:!0})}},asText:{value:function(a,b){fs.util.readAsText(a,b,{})}},tmpFileAsText:{value:function(a,b){fs.util.readAsText(a,b,{tmp:!0})}},asBinaryString:{value:function(a,b){fs.util.readAsBinaryString(a,b,{})}},tmpFileAsBinaryString:{value:function(a,b){fs.util.readAsBinaryString(a,b,{tmp:!0})}},asArrayBuffer:{value:function(a,b){fs.util.readAsArrayBuffer(a,
b,{})}},tmpFileAsArrayBuffer:{value:function(a,b){fs.util.readAsArrayBuffer(a,b,{tmp:!0})}},fileAsText:{value:function(a,b){fs.util.getReader(a,b,"readAsText")}},fileAsDataUrl:{value:function(a,b){fs.util.getReader(a,b,"readAsDataURL")}},fileAsArrayBuffer:{value:function(a,b){fs.util.readFileAsArrayBuffer(a,b)}},fileAsBinaryString:{value:function(a,b){fs.util.readFileAsBinaryString(a,b)}}});
fs.write=Object.create({},{file:{value:function(a,b,c){fs.util.writeFileToFile(a,b,{filename:c})}},fileToTmpFile:{value:function(a,b,c){fs.util.writeFileToFile(a,b,{tmp:!0,filename:c})}},blob:{value:function(a,b,c){fs.util.writeBlobToFile(a,b,c,{})}},blobToTmpFile:{value:function(a,b,c){fs.util.writeBlobToFile(a,b,c,{tmp:!0})}},text:{value:function(a,b,c){fs.util.writeTextToFile(a,b,c,{})}},textToTmpFile:{value:function(a,b,c){fs.util.writeTextToFile(a,b,c,{tmp:!0})}},base64Str:{value:function(a,
b,c,d){fs.util.writeBase64StrToFile(a,b,c,d,{})}},base64StrToTmpFile:{value:function(a,b,c,d){fs.util.writeBase64StrToFile(a,b,c,d,{tmp:!0})}}});
//id3 reader
/***/
/**
 * Copyright (c) 2010, António Afonso <antonio.afonso gmail.com>. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are
 * permitted provided that the following conditions are met:
 *
 *    1. Redistributions of source code must retain the above copyright notice, this list of
 *       conditions and the following disclaimer.
 *
 *    2. Redistributions in binary form must reproduce the above copyright notice, this list
 *       of conditions and the following disclaimer in the documentation and/or other materials
 *       provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY António Afonso ``AS IS'' AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
var StringUtils = {
    readUTF16String: function(bytes, bigEndian, maxBytes) {
        var ix = 0;
        var offset1 = 1, offset2 = 0;
        maxBytes = Math.min(maxBytes||bytes.length, bytes.length);

        if( bytes[0] == 0xFE && bytes[1] == 0xFF ) {
            bigEndian = true;
            ix = 2;
        } else if( bytes[0] == 0xFF && bytes[1] == 0xFE ) {
            bigEndian = false;
            ix = 2;
        }
        if( bigEndian ) {
            offset1 = 0;
            offset2 = 1;
        }

        var arr = [];
        for( var j = 0; ix < maxBytes; j++ ) {
            var byte1 = bytes[ix+offset1];
            var byte2 = bytes[ix+offset2];
            var word1 = (byte1<<8)+byte2;
            ix += 2;
            if( word1 == 0x0000 ) {
                break;
            } else if( byte1 < 0xD8 || byte1 >= 0xE0 ) {
                arr[j] = String.fromCharCode(word1);
            } else {
                var byte3 = bytes[ix+offset1];
                var byte4 = bytes[ix+offset2];
                var word2 = (byte3<<8)+byte4;
                ix += 2;
                arr[j] = String.fromCharCode(word1, word2);
            }
        }
        var string = new String(arr.join(""));
        string.bytesReadCount = ix;
        return string;
    },
    readUTF8String: function(bytes, maxBytes) {
        var ix = 0;
        maxBytes = Math.min(maxBytes||bytes.length, bytes.length);

        if( bytes[0] == 0xEF && bytes[1] == 0xBB && bytes[2] == 0xBF ) {
            ix = 3;
        }

        var arr = [];
        for( var j = 0; ix < maxBytes; j++ ) {
            var byte1 = bytes[ix++];
            if( byte1 == 0x00 ) {
                break;
            } else if( byte1 < 0x80 ) {
                arr[j] = String.fromCharCode(byte1);
            } else if( byte1 >= 0xC2 && byte1 < 0xE0 ) {
                var byte2 = bytes[ix++];
                arr[j] = String.fromCharCode(((byte1&0x1F)<<6) + (byte2&0x3F));
            } else if( byte1 >= 0xE0 && byte1 < 0xF0 ) {
                var byte2 = bytes[ix++];
                var byte3 = bytes[ix++];
                arr[j] = String.fromCharCode(((byte1&0xFF)<<12) + ((byte2&0x3F)<<6) + (byte3&0x3F));
            } else if( byte1 >= 0xF0 && byte1 < 0xF5) {
                var byte2 = bytes[ix++];
                var byte3 = bytes[ix++];
                var byte4 = bytes[ix++];
                var codepoint = ((byte1&0x07)<<18) + ((byte2&0x3F)<<12)+ ((byte3&0x3F)<<6) + (byte4&0x3F) - 0x10000;
                arr[j] = String.fromCharCode(
                    (codepoint>>10) + 0xD800,
                    (codepoint&0x3FF) + 0xDC00
                );
            }
        }
        var string = new String(arr.join(""));
        string.bytesReadCount = ix;
        return string;
    },
    readNullTerminatedString: function(bytes, maxBytes) {
        var arr = [];
        maxBytes = maxBytes || bytes.length;
        for ( var i = 0; i < maxBytes; ) {
            var byte1 = bytes[i++];
            if( byte1 == 0x00 ) break;
		    arr[i-1] = String.fromCharCode(byte1);
	    }
        var string = new String(arr.join(""));
        string.bytesReadCount = i;
        return string;
    },

   readWin1251String: function(str) {
       var charmap   = unescape(
          "%u0402%u0403%u201A%u0453%u201E%u2026%u2020%u2021%u20AC%u2030%u0409%u2039%u040A%u040C%u040B%u040F"+
          "%u0452%u2018%u2019%u201C%u201D%u2022%u2013%u2014%u0000%u2122%u0459%u203A%u045A%u045C%u045B%u045F"+
          "%u00A0%u040E%u045E%u0408%u00A4%u0490%u00A6%u00A7%u0401%u00A9%u0404%u00AB%u00AC%u00AD%u00AE%u0407"+
          "%u00B0%u00B1%u0406%u0456%u0491%u00B5%u00B6%u00B7%u0451%u2116%u0454%u00BB%u0458%u0405%u0455%u0457");
       var code2char = function(code) {
                   if(code >= 0xC0 && code <= 0xFF) return String.fromCharCode(code - 0xC0 + 0x0410)
                   if(code >= 0x80 && code <= 0xBF) return charmap.charAt(code - 0x80)
                   return String.fromCharCode(code)
                };
       var res = "";
       for(var i = 0; i < str.length; i++) res = res + code2char(str.charCodeAt(i))
       console.log('Win1251 result:',res);
       return res;
    }
};
/**
 * Buffered Binary Ajax 0.2.1
 * Copyright (c) 2010 António Afonso, antonio.afonso gmail, http://www.aadsm.net/
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 *
 * Adapted from Binary Ajax 0.1.5
 */

/**
 * @class Reads a remote file without having to download it all.
 *
 * Creates a new BufferedBinaryFile that will download chunks of the file pointed by the URL given only on a per need basis.
 *
 * @param {string} strUrl The URL with the location of the file to be read.
 * @param {number} iLength The size of the file.
 * @param {number} [blockSize=2048] The size of the chunk that will be downloaded when data is read.
 * @param {number} [blockRadius=0] The number of chunks, immediately after and before the chunk needed, that will also be downloaded.
 *
 * @constructor
 * @augments BinaryFile
 */
function BufferedBinaryFile(strUrl, iLength, blockSize, blockRadius) {
    var undefined;
    var downloadedBytesCount = 0;
    var binaryFile = new BinaryFile("", 0, iLength);
    var blocks = [];

    blockSize = blockSize || 1024*2;
    blockRadius = (typeof blockRadius === "undefined") ? 0 : blockRadius;
    blockTotal = ~~((iLength-1)/blockSize) + 1;

    function getBlockRangeForByteRange(range) {
        var blockStart = ~~(range[0]/blockSize) - blockRadius;
        var blockEnd = ~~(range[1]/blockSize)+1 + blockRadius;

        if( blockStart < 0 ) blockStart = 0;
        if( blockEnd >= blockTotal ) blockEnd = blockTotal-1;

        return [blockStart, blockEnd];
    }

    // TODO: wondering if a "recently used block" could help things around
    //       here.
    function getBlockAtOffset(offset) {
        var blockRange = getBlockRangeForByteRange([offset, offset]);
        waitForBlocks(blockRange);
        return blocks[~~(offset/blockSize)];
    }

    /**
     * @param {?function()} callback If a function is passed then this function will be asynchronous and the callback invoked when the blocks have been loaded, otherwise it blocks script execution until the request is completed.
     */
    function waitForBlocks(blockRange, callback) {
        // Filter out already downloaded blocks or return if found out that
        // the entire block range has already been downloaded.
        while( blocks[blockRange[0]] ) {
            blockRange[0]++;
            if( blockRange[0] > blockRange[1] ) return callback ? callback() : undefined;
        }
        while( blocks[blockRange[1]] ) {
            blockRange[1]--;
            if( blockRange[0] > blockRange[1] ) return callback ? callback() : undefined;
        }
        var range = [blockRange[0]*blockSize, (blockRange[1]+1)*blockSize-1];
        //console.log("Getting: " + range[0] + " to " +  range[1]);
        sendRequest(
            strUrl,
            function(http) {
                var size = parseInt(http.getResponseHeader("Content-Length"), 10);
                // Range header not supported
                if( size == iLength ) {
                    blockRange[0] = 0;
                    blockRange[1] = blockTotal-1;
                    range[0] = 0;
                    range[1] = iLength-1;
                }
                var block = {
                    data: http.responseBody || http.responseText,
                    offset: range[0]
                };

                for( var i = blockRange[0]; i <= blockRange[1]; i++ ) {
                    blocks[i] = block;
                }
                downloadedBytesCount += range[1] - range[0] + 1;
                if (callback) callback();
            },
            fncError,
            range,
            "bytes",
            undefined,
            !!callback
        );
    }

    // Mixin all BinaryFile's methods.
    // Not using prototype linking since the constructor needs to know
    // the length of the file.
    for( var key in binaryFile ) {
        if( binaryFile.hasOwnProperty(key) &&
            typeof binaryFile[key] === "function") {
            this[key] = binaryFile[key];
        }
    }
    /**
     * @override
     */
    this.getByteAt = function(iOffset) {
        var block = getBlockAtOffset(iOffset);
        if( typeof block.data == "string" ) {
            return block.data.charCodeAt(iOffset - block.offset) & 0xFF;
        } else if( typeof block.data == "unknown" ) {
            return IEBinary_getByteAt(block.data, iOffset - block.offset);
        }
    };

    /**
     * Gets the number of total bytes that have been downloaded.
     *
     * @returns The number of total bytes that have been downloaded.
     */
    this.getDownloadedBytesCount = function() {
        return downloadedBytesCount;
    };

    /**
     * Downloads the byte range given. Useful for preloading.
     *
     * @param {Array} range Two element array that denotes the first byte to be read on the first position and the last byte to be read on the last position. A range of [2, 5] will download bytes 2,3,4 and 5.
     * @param {?function()} callback The function to invoke when the blocks have been downloaded, this makes this call asynchronous.
     */
    this.loadRange = function(range, callback) {
        var blockRange = getBlockRangeForByteRange(range);
        waitForBlocks(blockRange, callback);
    };
}


/**
 * @constructor
 */
function BinaryFile(strData, iDataOffset, iDataLength) {
	var data = strData;
	var dataOffset = iDataOffset || 0;
	var dataLength = 0;

	this.getRawData = function() {
		return data;
	};

	if (typeof strData == "string") {
		dataLength = iDataLength || data.length;

		this.getByteAt = function(iOffset) {
			return data.charCodeAt(iOffset + dataOffset) & 0xFF;
		};
	} else if (typeof strData == "unknown") {
		dataLength = iDataLength || IEBinary_getLength(data);

		this.getByteAt = function(iOffset) {
			return IEBinary_getByteAt(data, iOffset + dataOffset);
		};
	}
    // @aadsm
    this.getBytesAt = function(iOffset, iLength) {
        var bytes = new Array(iLength);
        for( var i = 0; i < iLength; i++ ) {
            bytes[i] = this.getByteAt(iOffset+i);
        }
        return bytes;
    };

	this.getLength = function() {
		return dataLength;
	};

    // @aadsm
    this.isBitSetAt = function(iOffset, iBit) {
        var iByte = this.getByteAt(iOffset);
        return (iByte & (1 << iBit)) != 0;
    };

	this.getSByteAt = function(iOffset) {
		var iByte = this.getByteAt(iOffset);
		if (iByte > 127)
			return iByte - 256;
		else
			return iByte;
	};

	this.getShortAt = function(iOffset, bBigEndian) {
		var iShort = bBigEndian ?
			(this.getByteAt(iOffset) << 8) + this.getByteAt(iOffset + 1)
			: (this.getByteAt(iOffset + 1) << 8) + this.getByteAt(iOffset);
		if (iShort < 0) iShort += 65536;
		return iShort;
	};
	this.getSShortAt = function(iOffset, bBigEndian) {
		var iUShort = this.getShortAt(iOffset, bBigEndian);
		if (iUShort > 32767)
			return iUShort - 65536;
		else
			return iUShort;
	};
	this.getLongAt = function(iOffset, bBigEndian) {
		var iByte1 = this.getByteAt(iOffset),
			iByte2 = this.getByteAt(iOffset + 1),
			iByte3 = this.getByteAt(iOffset + 2),
			iByte4 = this.getByteAt(iOffset + 3);

		var iLong = bBigEndian ?
			(((((iByte1 << 8) + iByte2) << 8) + iByte3) << 8) + iByte4
			: (((((iByte4 << 8) + iByte3) << 8) + iByte2) << 8) + iByte1;
		if (iLong < 0) iLong += 4294967296;
		return iLong;
	};
	this.getSLongAt = function(iOffset, bBigEndian) {
		var iULong = this.getLongAt(iOffset, bBigEndian);
		if (iULong > 2147483647)
			return iULong - 4294967296;
		else
			return iULong;
	};
	// @aadsm
	this.getInteger24At = function(iOffset, bBigEndian) {
        var iByte1 = this.getByteAt(iOffset),
			iByte2 = this.getByteAt(iOffset + 1),
			iByte3 = this.getByteAt(iOffset + 2);

		var iInteger = bBigEndian ?
			((((iByte1 << 8) + iByte2) << 8) + iByte3)
			: ((((iByte3 << 8) + iByte2) << 8) + iByte1);
		if (iInteger < 0) iInteger += 16777216;
		return iInteger;
    };
	this.getStringAt = function(iOffset, iLength) {
		var aStr = [];
		for (var i=iOffset,j=0;i<iOffset+iLength;i++,j++) {
			aStr[j] = String.fromCharCode(this.getByteAt(i));
		}
		return aStr.join("");
	};
	// @aadsm
	this.getStringWithCharsetAt = function(iOffset, iLength, iCharset) {
		if(!(iOffset>0) || !(iLength>0)){
		    return '';
		}
		var bytes = this.getBytesAt(iOffset, iLength),
		    originalString = this.getStringAt(iOffset, iLength),
		    iCharset=iCharset || jschardet.detect(originalString).encoding,
		    sString;
        console.log('Charset:',iCharset);

		switch( iCharset.toLowerCase() ) {

		    case 'utf-16':
		    case 'utf-16le':
		    case 'utf-16be':
		        sString = StringUtils.readUTF16String(bytes, iCharset);
		        break;

		    case 'utf-8':
		        sString = StringUtils.readUTF8String(bytes);
		        break;
            case 'iso-8859-1':
                var charsetDetection=jschardet.detect(originalString);
                console.log('Detection:',charsetDetection);
                if('TIS-620'===charsetDetection.encoding ||
                'windows-1253'===charsetDetection.encoding ||
                'windows-1251'===charsetDetection.encoding ||
                'EUC-TV'===charsetDetection.encoding){
                    sString = StringUtils.readWin1251String(originalString);
                    break;
                }
            case 'windows-1251':
                sString = StringUtils.readWin1251String(originalString);
                break;
            case 'maccyrillic':
                sString = StringUtils.readWin1251String(originalString);
                break;
		    default:
		        sString = StringUtils.readNullTerminatedString(bytes);
		        break;
		}
        console.log('Result',sString);
		return sString;
	};

	this.getCharAt = function(iOffset) {
		return String.fromCharCode(this.getByteAt(iOffset));
	};
	this.toBase64 = function() {
		return window.btoa(data);
	};
	this.fromBase64 = function(strBase64) {
		data = window.atob(strBase64);
	};

    this.loadRange = function(range, callback) {
        callback();
    };
}
/**
 * Copyright (c) 2011 Anton Podviaznikov, podviaznikov@gmail.com
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 *
 */
 (function(ns) {
    ns["FileAPIReader"] = function(binaryData) {
        return function(url, fncCallback, fncError) {
                fncCallback(new BinaryFile(binaryData));
        }
    };
})(this);

// Modified version of http://www.webtoolkit.info/javascript-base64.html
(function(ns) {
    ns.Base64 = {
    	// private property
    	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    	// public method for encoding
    	encodeBytes : function (input) {
    		var output = "";
    		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    		var i = 0;

    		while (i < input.length) {

    			chr1 = input[i++];
    			chr2 = input[i++];
    			chr3 = input[i++];

    			enc1 = chr1 >> 2;
    			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    			enc4 = chr3 & 63;

    			if (isNaN(chr2)) {
    				enc3 = enc4 = 64;
    			} else if (isNaN(chr3)) {
    				enc4 = 64;
    			}

    			output = output +
    			Base64._keyStr.charAt(enc1) + Base64._keyStr.charAt(enc2) +
    			Base64._keyStr.charAt(enc3) + Base64._keyStr.charAt(enc4);

    		}

    		return output;
    	}
    };

    // Export functions for closure compiler
    ns["Base64"] = ns.Base64;
    ns.Base64["encodeBytes"] = ns.Base64.encodeBytes;
})(this);
/*
 * JavaScript ID3 Tag Reader 0.1.2
 * Copyright (c) 2008 Jacob Seidelin, cupboy@gmail.com, http://blog.nihilogic.dk/
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 *
 * Extended by António Afonso (antonio.afonso@opera.com), Opera Software ASA
 * Modified by António Afonso <antonio.afonso gmail.com>
 */

(function(ns) {
    var ID3 = ns.ID3 = {};

    var _files = {};
    // location of the format identifier
    var _formatIDRange = [0, 7];

    /**
     * Finds out the tag format of this data and returns the appropriate
     * reader.
     */
    function getTagReader(data) {
        // FIXME: improve this detection according to the spec
        return data.getStringAt(4, 7) == "ftypM4A" ? ID4 :
               (data.getStringAt(0, 3) == "ID3" ? ID3v2 : ID3v1);
    }

    function readTags(reader, data, url, tags) {
        var tagsFound = reader.readTagsFromData(data, tags);
        var tags = _files[url] || {};
        for( var tag in tagsFound ) if( tagsFound.hasOwnProperty(tag) ) {
            tags[tag] = tagsFound[tag];
        }
        _files[url] = tags;
    }

    /**
     * @param {string} url The location of the sound file to read.
     * @param {function()} cb The callback function to be invoked when all tags have been read.
     * @param {{tags: Array.<string>, dataReader: function(string, function(BinaryReader))}} options The set of options that can specify the tags to be read and the dataReader to use in order to read the file located at url.
     */
    ID3.loadTags = function(url, cb, options) {
        options = options || {};
        var dataReader = options["dataReader"];

        dataReader(url, function(data) {
            // preload the format identifier
            data.loadRange(_formatIDRange, function() {
                var reader = getTagReader(data);
                reader.loadData(data, function() {
                    readTags(reader, data, url, options["tags"]);
                    if( cb ) cb();
                });
            });
        });
    };

    ID3.getAllTags = function(url) {
        if (!_files[url]) return null;

        var tags = {};
        for (var a in _files[url]) {
            if (_files[url].hasOwnProperty(a))
                tags[a] = _files[url][a];
        }
        return tags;
    };

    ID3.getTag = function(url, tag) {
        if (!_files[url]) return null;

        return _files[url][tag];
    };

    // Export functions for closure compiler
    ns["ID3"] = ns.ID3;
    ID3["loadTags"] = ID3.loadTags;
    ID3["getAllTags"] = ID3.getAllTags;
    ID3["getTag"] = ID3.getTag;
})(this);
/*
 * JavaScript ID3 Tag Reader 0.1.2
 * Copyright (c) 2008 Jacob Seidelin, cupboy@gmail.com, http://blog.nihilogic.dk/
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 *
 * Extended by António Afonso (antonio.afonso@opera.com), Opera Software ASA
 * Modified by António Afonso (antonio.afonso gmail.com)
 */

(function(ns) {
    var ID3v1 = ns.ID3v1 = {};
    var genres = [
    	"Blues","Classic Rock","Country","Dance","Disco","Funk","Grunge",
    	"Hip-Hop","Jazz","Metal","New Age","Oldies","Other","Pop","R&B",
    	"Rap","Reggae","Rock","Techno","Industrial","Alternative","Ska",
    	"Death Metal","Pranks","Soundtrack","Euro-Techno","Ambient",
    	"Trip-Hop","Vocal","Jazz+Funk","Fusion","Trance","Classical",
    	"Instrumental","Acid","House","Game","Sound Clip","Gospel",
    	"Noise","AlternRock","Bass","Soul","Punk","Space","Meditative",
    	"Instrumental Pop","Instrumental Rock","Ethnic","Gothic",
    	"Darkwave","Techno-Industrial","Electronic","Pop-Folk",
    	"Eurodance","Dream","Southern Rock","Comedy","Cult","Gangsta",
    	"Top 40","Christian Rap","Pop/Funk","Jungle","Native American",
    	"Cabaret","New Wave","Psychadelic","Rave","Showtunes","Trailer",
    	"Lo-Fi","Tribal","Acid Punk","Acid Jazz","Polka","Retro",
    	"Musical","Rock & Roll","Hard Rock","Folk","Folk-Rock",
    	"National Folk","Swing","Fast Fusion","Bebob","Latin","Revival",
    	"Celtic","Bluegrass","Avantgarde","Gothic Rock","Progressive Rock",
    	"Psychedelic Rock","Symphonic Rock","Slow Rock","Big Band",
    	"Chorus","Easy Listening","Acoustic","Humour","Speech","Chanson",
    	"Opera","Chamber Music","Sonata","Symphony","Booty Bass","Primus",
    	"Porn Groove","Satire","Slow Jam","Club","Tango","Samba",
    	"Folklore","Ballad","Power Ballad","Rhythmic Soul","Freestyle",
    	"Duet","Punk Rock","Drum Solo","Acapella","Euro-House","Dance Hall"
    ];

    ID3v1.loadData = function(data, callback) {
        var length = data.getLength();
        data.loadRange([length-128-1, length], callback);
    }

    ID3v1.readTagsFromData = function(data) {
    	var offset = data.getLength() - 128;
    	var header = data.getStringAt(offset, 3);
    	if (header == "TAG") {
    		var title = data.getStringWithCharsetAt(offset + 3, 30).replace(/\0/g, "");
    		var artist = data.getStringWithCharsetAt(offset + 33, 30).replace(/\0/g, "");
    		var album = data.getStringWithCharsetAt(offset + 63, 30).replace(/\0/g, "");
    		var year = data.getStringAt(offset + 93, 4).replace(/\0/g, "");

    		var trackFlag = data.getByteAt(offset + 97 + 28);
    		if (trackFlag == 0) {
    			var comment = data.getStringAt(offset + 97, 28).replace(/\0/g, "");
    			var track = data.getByteAt(offset + 97 + 29);
    		} else {
    			var comment = "";
    			var track = 0;
    		}

    		var genreIdx = data.getByteAt(offset + 97 + 30);
    		if (genreIdx < 255) {
    			var genre = genres[genreIdx];
    		} else {
    			var genre = "";
    		}

    		return {
    		    "version" : '1.1',
    			"title" : title,
    			"artist" : artist,
    			"album" : album,
    			"year" : year,
    			"comment" : comment,
    			"track" : track,
    			"genre" : genre
    		}
    	} else {
    		return {};
    	}
    };

    // Export functions for closure compiler
    ns["ID3v1"] = ns.ID3v1;
})(this);
/*
 * Copyright (c) 2009 Opera Software ASA, António Afonso (antonio.afonso@opera.com)
 * Modified by António Afonso <antonio.afonso gmail.com>
 */

(function(ns) {
    var ID3v2 = ns.ID3v2 = {};

    ID3v2.readFrameData = {};
    ID3v2.frames = {
        // v2.2
        "BUF" : "Recommended buffer size",
        "CNT" : "Play counter",
        "COM" : "Comments",
        "CRA" : "Audio encryption",
        "CRM" : "Encrypted meta frame",
        "ETC" : "Event timing codes",
        "EQU" : "Equalization",
        "GEO" : "General encapsulated object",
        "IPL" : "Involved people list",
        "LNK" : "Linked information",
        "MCI" : "Music CD Identifier",
        "MLL" : "MPEG location lookup table",
        "PIC" : "Attached picture",
        "POP" : "Popularimeter",
        "REV" : "Reverb",
        "RVA" : "Relative volume adjustment",
        "SLT" : "Synchronized lyric/text",
        "STC" : "Synced tempo codes",
        "TAL" : "Album/Movie/Show title",
        "TBP" : "BPM (Beats Per Minute)",
        "TCM" : "Composer",
        "TCO" : "Content type",
        "TCR" : "Copyright message",
        "TDA" : "Date",
        "TDY" : "Playlist delay",
        "TEN" : "Encoded by",
        "TFT" : "File type",
        "TIM" : "Time",
        "TKE" : "Initial key",
        "TLA" : "Language(s)",
        "TLE" : "Length",
        "TMT" : "Media type",
        "TOA" : "Original artist(s)/performer(s)",
        "TOF" : "Original filename",
        "TOL" : "Original Lyricist(s)/text writer(s)",
        "TOR" : "Original release year",
        "TOT" : "Original album/Movie/Show title",
        "TP1" : "Lead artist(s)/Lead performer(s)/Soloist(s)/Performing group",
        "TP2" : "Band/Orchestra/Accompaniment",
        "TP3" : "Conductor/Performer refinement",
        "TP4" : "Interpreted, remixed, or otherwise modified by",
        "TPA" : "Part of a set",
        "TPB" : "Publisher",
        "TRC" : "ISRC (International Standard Recording Code)",
        "TRD" : "Recording dates",
        "TRK" : "Track number/Position in set",
        "TSI" : "Size",
        "TSS" : "Software/hardware and settings used for encoding",
        "TT1" : "Content group description",
        "TT2" : "Title/Songname/Content description",
        "TT3" : "Subtitle/Description refinement",
        "TXT" : "Lyricist/text writer",
        "TXX" : "User defined text information frame",
        "TYE" : "Year",
        "UFI" : "Unique file identifier",
        "ULT" : "Unsychronized lyric/text transcription",
        "WAF" : "Official audio file webpage",
        "WAR" : "Official artist/performer webpage",
        "WAS" : "Official audio source webpage",
        "WCM" : "Commercial information",
        "WCP" : "Copyright/Legal information",
        "WPB" : "Publishers official webpage",
        "WXX" : "User defined URL link frame",
        // v2.3
        "AENC" : "Audio encryption",
        "APIC" : "Attached picture",
        "COMM" : "Comments",
        "COMR" : "Commercial frame",
        "ENCR" : "Encryption method registration",
        "EQUA" : "Equalization",
        "ETCO" : "Event timing codes",
        "GEOB" : "General encapsulated object",
        "GRID" : "Group identification registration",
        "IPLS" : "Involved people list",
        "LINK" : "Linked information",
        "MCDI" : "Music CD identifier",
        "MLLT" : "MPEG location lookup table",
        "OWNE" : "Ownership frame",
        "PRIV" : "Private frame",
        "PCNT" : "Play counter",
        "POPM" : "Popularimeter",
        "POSS" : "Position synchronisation frame",
        "RBUF" : "Recommended buffer size",
        "RVAD" : "Relative volume adjustment",
        "RVRB" : "Reverb",
        "SYLT" : "Synchronized lyric/text",
        "SYTC" : "Synchronized tempo codes",
        "TALB" : "Album/Movie/Show title",
        "TBPM" : "BPM (beats per minute)",
        "TCOM" : "Composer",
        "TCON" : "Content type",
        "TCOP" : "Copyright message",
        "TDAT" : "Date",
        "TDLY" : "Playlist delay",
        "TENC" : "Encoded by",
        "TEXT" : "Lyricist/Text writer",
        "TFLT" : "File type",
        "TIME" : "Time",
        "TIT1" : "Content group description",
        "TIT2" : "Title/songname/content description",
        "TIT3" : "Subtitle/Description refinement",
        "TKEY" : "Initial key",
        "TLAN" : "Language(s)",
        "TLEN" : "Length",
        "TMED" : "Media type",
        "TOAL" : "Original album/movie/show title",
        "TOFN" : "Original filename",
        "TOLY" : "Original lyricist(s)/text writer(s)",
        "TOPE" : "Original artist(s)/performer(s)",
        "TORY" : "Original release year",
        "TOWN" : "File owner/licensee",
        "TPE1" : "Lead performer(s)/Soloist(s)",
        "TPE2" : "Band/orchestra/accompaniment",
        "TPE3" : "Conductor/performer refinement",
        "TPE4" : "Interpreted, remixed, or otherwise modified by",
        "TPOS" : "Part of a set",
        "TPUB" : "Publisher",
        "TRCK" : "Track number/Position in set",
        "TRDA" : "Recording dates",
        "TRSN" : "Internet radio station name",
        "TRSO" : "Internet radio station owner",
        "TSIZ" : "Size",
        "TSRC" : "ISRC (international standard recording code)",
        "TSSE" : "Software/Hardware and settings used for encoding",
        "TYER" : "Year",
        "TXXX" : "User defined text information frame",
        "UFID" : "Unique file identifier",
        "USER" : "Terms of use",
        "USLT" : "Unsychronized lyric/text transcription",
        "WCOM" : "Commercial information",
        "WCOP" : "Copyright/Legal information",
        "WOAF" : "Official audio file webpage",
        "WOAR" : "Official artist/performer webpage",
        "WOAS" : "Official audio source webpage",
        "WORS" : "Official internet radio station homepage",
        "WPAY" : "Payment",
        "WPUB" : "Publishers official webpage",
        "WXXX" : "User defined URL link frame"
    };

    var _shortcuts = {
        "title"     : ["TIT2", "TT2"],
        "artist"    : ["TPE1", "TP1"],
        "album"     : ["TALB", "TAL"],
        "year"      : ["TYER", "TYE"],
        "comment"   : ["COMM", "COM"],
        "track"     : ["TRCK", "TRK"],
        "genre"     : ["TCON", "TCO"],
        "picture"   : ["APIC", "PIC"],
        "lyrics"    : ["USLT", "ULT"]
    };
    var _defaultShortcuts = ["title", "artist", "album", "track"];

    function getTagsFromShortcuts(shortcuts) {
        var tags = [];
        for( var i = 0, shortcut; shortcut = shortcuts[i]; i++ ) {
            tags = tags.concat(_shortcuts[shortcut]||[shortcut]);
        }
        return tags;
    }

    // The ID3v2 tag/frame size is encoded with four bytes where the most significant bit (bit 7) is set to zero in every byte, making a total of 28 bits. The zeroed bits are ignored, so a 257 bytes long tag is represented as $00 00 02 01.
    function readSynchsafeInteger32At(offset, data) {
        var size1 = data.getByteAt(offset);
        var size2 = data.getByteAt(offset+1);
        var size3 = data.getByteAt(offset+2);
        var size4 = data.getByteAt(offset+3);
        // 0x7f = 0b01111111
        var size = size4 & 0x7f
                 | ((size3 & 0x7f) << 7)
                 | ((size2 & 0x7f) << 14)
                 | ((size1 & 0x7f) << 21);

        return size;
    }

    function readFrameFlags(data, offset)
    {
        var flags =
        {
            message:
            {
                tag_alter_preservation  : data.isBitSetAt( offset, 6),
                file_alter_preservation : data.isBitSetAt( offset, 5),
                read_only               : data.isBitSetAt( offset, 4)
            },
            format:
            {
                grouping_identity       : data.isBitSetAt( offset+1, 7),
                compression             : data.isBitSetAt( offset+1, 3),
                encription              : data.isBitSetAt( offset+1, 2),
                unsynchronisation       : data.isBitSetAt( offset+1, 1),
                data_length_indicator   : data.isBitSetAt( offset+1, 0)
            }
        };

        return flags;
    }

    /** All the frames consists of a frame header followed by one or more fields containing the actual information.
     * The frame ID made out of the characters capital A-Z and 0-9. Identifiers beginning with "X", "Y" and "Z" are for experimental use and free for everyone to use, without the need to set the experimental bit in the tag header. Have in mind that someone else might have used the same identifier as you. All other identifiers are either used or reserved for future use.
     * The frame ID is followed by a size descriptor, making a total header size of ten bytes in every frame. The size is calculated as frame size excluding frame header (frame size - 10).
     */
    function readFrames(offset, end, data, id3header, tags)
    {
        var frames = {};
        var frameDataSize;
        var major = id3header["major"];

        tags = getTagsFromShortcuts(tags || _defaultShortcuts);

        while( offset < end ) {
            var readFrameFunc = null;
            var frameData = data;
            var frameDataOffset = offset;
            var flags = null;

            switch( major ) {
                case 2:
                var frameID = frameData.getStringAt(frameDataOffset, 3);
                var frameSize = frameData.getInteger24At(frameDataOffset+3, true);
                var frameHeaderSize = 6;
                break;

                case 3:
                var frameID = frameData.getStringAt(frameDataOffset, 4);
                var frameSize = frameData.getLongAt(frameDataOffset+4, true);
                var frameHeaderSize = 10;
                break;

                case 4:
                var frameID = frameData.getStringAt(frameDataOffset, 4);
                var frameSize = readSynchsafeInteger32At(frameDataOffset+4, frameData);
                var frameHeaderSize = 10;
                break;
            }
            // if last frame GTFO
            if( frameID == "" ) { break; }

            // advance data offset to the next frame data
            offset += frameHeaderSize + frameSize;
            // skip unwanted tags
            if( tags.indexOf( frameID ) < 0 ) { continue; }

            // read frame message and format flags
            if( major > 2 )
            {
                flags = readFrameFlags(frameData, frameDataOffset+8);
            }

            frameDataOffset += frameHeaderSize;

            // the first 4 bytes are the real data size
            // (after unsynchronisation && encryption)
            if( flags && flags.format.data_length_indicator )
            {
                frameDataSize = readSynchsafeInteger32At(frameDataOffset, frameData);
                frameDataOffset += 4;
                frameSize -= 4;
            }

            // TODO: support unsynchronisation
            if( flags && flags.format.unsynchronisation )
            {
                //frameData = removeUnsynchronisation(frameData, frameSize);
                continue;
            }

            // find frame parsing function
            if( frameID in ID3v2.readFrameData ) {
                readFrameFunc = ID3v2.readFrameData[frameID];
            } else if( frameID[0] == "T" ) {
                readFrameFunc = ID3v2.readFrameData["T*"];
            }

            var parsedData = readFrameFunc ? readFrameFunc(frameDataOffset, frameSize, frameData, flags) : undefined;
            var desc = frameID in ID3v2.frames ? ID3v2.frames[frameID] : 'Unknown';

            var frame = {
                id          : frameID,
                size        : frameSize,
                description : desc,
                data        : parsedData
            };

            if( frameID in frames ) {
                if( frames[frameID].id ) {
                    frames[frameID] = [frames[frameID]];
                }
                frames[frameID].push(frame);
            } else {
                frames[frameID] = frame;
            }
        }

        return frames;
    }

    //function removeUnsynchronisation(data, size)
    //{
    //    return data;
    //}

    function getFrameData( frames, ids ) {
        if( typeof ids == 'string' ) { ids = [ids]; }

        for( var i = 0, id; id = ids[i]; i++ ) {
            if( id in frames ) { return frames[id].data; }
        }
    }

    ID3v2.loadData = function(data, callback) {
        data.loadRange([0, readSynchsafeInteger32At(6, data)], callback);
    };

    // http://www.id3.org/id3v2.3.0
    ID3v2.readTagsFromData = function(data, tags) {
        var offset = 0;
        var major = data.getByteAt(offset+3);
        if( major > 4 ) { return {version: '>2.4'}; }
        var revision = data.getByteAt(offset+4);
        var unsynch = data.isBitSetAt(offset+5, 7);
        var xheader = data.isBitSetAt(offset+5, 6);
        var xindicator = data.isBitSetAt(offset+5, 5);
        var size = readSynchsafeInteger32At(offset+6, data);
        offset += 10;

        if( xheader ) {
            var xheadersize = data.getLongAt(offset, true);
            // The 'Extended header size', currently 6 or 10 bytes, excludes itself.
            offset += xheadersize + 4;
        }

        var id3 = {
    	    "version" : '2.' + major + '.' + revision,
    	    "major" : major,
    	    "revision" : revision,
    	    "flags" : {
    	        "unsynchronisation" : unsynch,
    	        "extended_header" : xheader,
    	        "experimental_indicator" : xindicator
    	    },
    	    "size" : size
    	};
        var frames = unsynch ? {} : readFrames(offset, size-10, data, id3, tags);
    	// create shortcuts for most common data
    	for( var name in _shortcuts ) if(_shortcuts.hasOwnProperty(name)) {
    	    var data = getFrameData( frames, _shortcuts[name] );
    	    if( data ) id3[name] = data;
    	}

    	for( var frame in frames ) {
    	    if( frames.hasOwnProperty(frame) ) {
    	        id3[frame] = frames[frame];
    	    }
    	}

    	return id3;
    };

    // Export functions for closure compiler
    ns["ID3v2"] = ID3v2;
})(this);
/*
 * Copyright (c) 2009 Opera Software ASA, António Afonso (antonio.afonso@opera.com)
 * Modified by António Afonso <antonio.afonso gmail.com>
 */
(function() {
    var pictureType = [
        "32x32 pixels 'file icon' (PNG only)",
        "Other file icon",
        "Cover (front)",
        "Cover (back)",
        "Leaflet page",
        "Media (e.g. lable side of CD)",
        "Lead artist/lead performer/soloist",
        "Artist/performer",
        "Conductor",
        "Band/Orchestra",
        "Composer",
        "Lyricist/text writer",
        "Recording Location",
        "During recording",
        "During performance",
        "Movie/video screen capture",
        "A bright coloured fish",
        "Illustration",
        "Band/artist logotype",
        "Publisher/Studio logotype"
    ];

    function getTextEncoding( bite ) {
        var charset;
        switch( bite )
        {
            case 0x00:
                charset = 'iso-8859-1';
                break;

            case 0x01:
                charset = 'utf-16';
                break;

            case 0x02:
                charset = 'utf-16be';
                break;

            case 0x03:
                charset = 'utf-8';
                break;
        }

        return charset;
    }

    function getTime( duration )
    {
        var duration    = duration/1000,
            seconds     = Math.floor( duration ) % 60,
            minutes     = Math.floor( duration/60 ) % 60,
            hours       = Math.floor( duration/3600 );

        return {
            seconds : seconds,
            minutes : minutes,
            hours   : hours
        };
    }

    function formatTime( time )
    {
        var seconds = time.seconds < 10 ? '0'+time.seconds : time.seconds;
        var minutes = (time.hours > 0 && time.minutes < 10) ? '0'+time.minutes : time.minutes;

        return (time.hours>0?time.hours+':':'') + minutes + ':' + seconds;
    }

    ID3v2.readFrameData['APIC'] = function readPictureFrame(offset, length, data, flags, v) {
        v = v || '3';
        return {
            "format" : '',
            "type" : '',
            "description" : '',
            "data" : ''
        };
    };

    ID3v2.readFrameData['COMM'] = function readCommentsFrame(offset, length, data) {
        var start = offset;
        var charset = getTextEncoding( data.getByteAt(offset) );
        var language = data.getStringAt( offset+1, 3 );
        var shortdesc = data.getStringWithCharsetAt(offset+4, length-4, charset);

        offset += 4 + shortdesc.bytesReadCount;
        var text = data.getStringWithCharsetAt( offset, (start+length) - offset, charset );

        return {
            language : language,
            short_description : shortdesc.toString(),
            text : text.toString()
        };
    };

    ID3v2.readFrameData['COM'] = ID3v2.readFrameData['COMM'];

    ID3v2.readFrameData['PIC'] = function(offset, length, data, flags) {
        return ID3v2.readFrameData['APIC'](offset, length, data, flags, '2');
    };

    ID3v2.readFrameData['PCNT'] = function readCounterFrame(offset, length, data) {
        // FIXME: implement the rest of the spec
        return data.getInteger32At(offset);
    };

    ID3v2.readFrameData['CNT'] = ID3v2.readFrameData['PCNT'];

    ID3v2.readFrameData['T*'] = function readTextFrame(offset, length, data) {
        var charset = getTextEncoding( data.getByteAt(offset) );

        return data.getStringWithCharsetAt(offset+1, length-1, charset).toString();
    };

    ID3v2.readFrameData['TCON'] = function readGenreFrame(offset, length, data) {
        var text = ID3v2.readFrameData['T*'].apply( this, arguments );
        return text.replace(/^\(\d+\)/, '');
    };

    ID3v2.readFrameData['TCO'] = ID3v2.readFrameData['TCON'];

    //ID3v2.readFrameData['TLEN'] = function readLengthFrame(offset, length, data) {
    //    var text = ID3v2.readFrameData['T*'].apply( this, arguments );
    //
    //    return {
    //        text : text,
    //        parsed : formatTime( getTime(parseInt(text)) )
    //    };
    //};

    ID3v2.readFrameData['USLT'] = function readLyricsFrame(offset, length, data) {
        var start = offset;
        var charset = getTextEncoding( data.getByteAt(offset) );
        var language = data.getStringAt( offset+1, 3 );
        var descriptor = data.getStringWithCharsetAt( offset+4, length-4, charset );

        offset += 4 + descriptor.bytesReadCount;
        var lyrics = data.getStringWithCharsetAt( offset, (start+length) - offset, charset );

        return {
            language : language,
            descriptor : descriptor.toString(),
            lyrics : lyrics.toString()
        };
    };

    ID3v2.readFrameData['ULT'] = ID3v2.readFrameData['USLT'];
})();
/*
 * Support for iTunes-style m4a tags
 * See:
 *   http://atomicparsley.sourceforge.net/mpeg-4files.html
 *   http://developer.apple.com/mac/library/documentation/QuickTime/QTFF/Metadata/Metadata.html
 * Authored by Joshua Kifer <joshua.kifer gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

(function(ns) {
    var ID4 = ns.ID4 = {};

    ID4.types = {
        '0'     : 'uint8',
        '1'     : 'text',
        '13'    : 'jpeg',
        '14'    : 'png',
        '21'    : 'uint8'
    };
    ID4.atom = {
        '©alb': ['album'],
        '©art': ['artist'],
        '©ART': ['artist'],
        'aART': ['artist'],
        '©day': ['year'],
        '©nam': ['title'],
        '©gen': ['genre'],
        'trkn': ['track'],
        '©wrt': ['composer'],
        '©too': ['encoder'],
        'cprt': ['copyright'],
        'covr': ['picture'],
        '©grp': ['grouping'],
        'keyw': ['keyword'],
        '©lyr': ['lyrics'],
        '©gen': ['genre']
    };

    ID4.loadData = function(data, callback) {
        // load the header of the first block
        data.loadRange([0, 7], function () {
            loadAtom(data, 0, data.getLength(), callback);
        });
    };

    /**
     * Make sure that the [offset, offset+7] bytes (the block header) are
     * already loaded before calling this function.
     */
    function loadAtom(data, offset, length, callback) {
        // 8 is the size of the atomSize and atomName fields.
        // When reading the current block we always read 8 more bytes in order
        // to also read the header of the next block.
        var atomSize = data.getLongAt(offset, true);
        if (atomSize == 0) return callback();
        var atomName = data.getStringAt(offset + 4, 4);

        // Container atoms
        if (['moov', 'udta', 'meta', 'ilst'].indexOf(atomName) > -1)
        {
            if (atomName == 'meta') offset += 4; // next_item_id (uint32)
            data.loadRange([offset+8, offset+8 + 8], function() {
                loadAtom(data, offset + 8, atomSize - 8, callback);
            });
        } else {
            // Value atoms
            var readAtom = atomName in ID4.atom;
            data.loadRange([offset+(readAtom?0:atomSize), offset+atomSize + 8], function() {
                loadAtom(data, offset+atomSize, length, callback);
            });
        }
    };

    ID4.readTagsFromData = function(data) {
        var tag = {};
        readAtom(tag, data, 0, data.getLength());
        return tag;
    };

    function readAtom(tag, data, offset, length, indent)
    {
        indent = indent === undefined ? "" : indent + "  ";
        var seek = offset;
        while (seek < offset + length)
        {
            var atomSize = data.getLongAt(seek, true);
            if (atomSize == 0) return;
            var atomName = data.getStringAt(seek + 4, 4);
            // Container atoms
            if (['moov', 'udta', 'meta', 'ilst'].indexOf(atomName) > -1)
            {
                if (atomName == 'meta') seek += 4; // next_item_id (uint32)
                readAtom(tag, data, seek + 8, atomSize - 8, indent);
                return;
            }
            // Value atoms
            if (ID4.atom[atomName])
            {
                var klass = data.getInteger24At(seek + 16 + 1, true);
                var atom = ID4.atom[atomName];
                var type = ID4.types[klass];
                if (atomName == 'trkn')
                {
                    tag[atom[0]] = data.getByteAt(seek + 16 + 11);
                    tag['count'] = data.getByteAt(seek + 16 + 13);
                }
                else
                {
                    // 16: name + size + "data" + size (4 bytes each)
                    // 4: atom version (1 byte) + atom flags (3 bytes)
                    // 4: NULL (usually locale indicator)
                    var dataStart = seek + 16 + 4 + 4;
                    var dataEnd = atomSize - 16 - 4 - 4;
                    switch( type ) {
                        case 'text':
                            tag[atom[0]] = data.getStringWithCharsetAt(dataStart, dataEnd, "UTF-8");
                            break;

                        case 'uint8':
                            tag[atom[0]] = data.getShortAt(dataStart);
                            break;

                        case 'jpeg':
                        case 'png':
                            tag[atom[0]] = {
                                format  : "image/" + type,
                                data    : data.getBytesAt(dataStart, dataEnd)
                            };
                            break;
                    }
                }
            }
            seek += atomSize;
        }
    }

    // Export functions for closure compiler
    ns["ID4"] = ns.ID4;
})(this);
//audioEl
var MicroEventEmitter=Object.create({},{events:{value:{}},on:{value:function(a,c){this.events[a]=this.events[a]||[];this.events[a].push(c)}},fire:{value:function(a){if(a in this.events!==!1)for(var c=this.events[a],b=0;b<c.length;b++)c[b].apply(this,Array.prototype.slice.call(arguments,1))}}}),AudioEl=Object.create({},{version:{value:0.5},newAudio:{value:function(a,c){var b=Object.create(AudioEl.Audio);b.init(a,c);return b}},Audio:{value:Object.create(MicroEventEmitter,{init:{value:function(a,c){var b=
this,c=c||{};this.el=document.getElementById(a);c.url&&this.el.setAttribute("src",c.url);if(c.volume)this.volume=c.volume;this.el.addEventListener("play",function(){b.fire("started")});this.el.addEventListener("timeupdate",function(){b.fire("updated",b.duration,b.time)});this.el.addEventListener("volumechange",function(){b.fire("volumechange")});this.el.addEventListener("pause",function(){b.fire("paused")});this.el.addEventListener("ended",function(){b.fire("finished")});return this}},play:{value:function(a){a&&
this.el.setAttribute("src",a);this.el.play()}},pause:{value:function(){this.el.pause()}},isPaused:{value:function(){return this.el.paused}},stop:{value:function(){this.pause();this.el.currentTime=0;this.fire("stopped")}},isFinished:{value:function(){return this.el.ended}},volumeOn:{value:function(){this.el.muted=!1}},volumeOff:{value:function(){this.el.muted=!0}},toggleVolume:{value:function(){this.el.muted=!this.el.muted}},isVolumeOn:{value:function(){return this.el.muted!==!0}},volume:{get:function(){return this.el.volume},
set:function(a){a<0&&(a=0);a>1&&(a=1);this.el.volume=a}},duration:{get:function(){return this.el.duration}},time:{get:function(){return this.el.currentTime},set:function(a){this.el.currentTime=a}},percent:{get:function(){return this.time/this.duration*100}},hours:{get:function(){var a=Math.floor(this.time/3600,10);return isNaN(a)?0:a}},minutes:{get:function(){var a=Math.floor((this.time-this.hours*3600)/60,10);return isNaN(a)?0:a}},seconds:{get:function(){return parseInt(this.time-this.hours*3600-
this.minutes*60,10)}},timeCounter:{get:function(){var a=this.hours,c=this.minutes,b=this.seconds;return a>0?a+":"+(c>9?c:"0"+c)+":"+(b>9?b:"0"+b):c+":"+(b>9?b:"0"+b)}}})}});
