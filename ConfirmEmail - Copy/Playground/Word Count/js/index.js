let $container = $('.container');
let $backdrop = $('.backdrop');
let $highlights = $('.highlights');
let $textarea = $('#mainT');
let $toggle = $('#countBtn');

// let reqInp = true;
// let reqScr = true;
let pending = false;

// yeah, browser sniffing sucks, but there are browser-specific quirks to handle that are not a matter of feature detection
let ua = window.navigator.userAgent.toLowerCase();
let isIE = !!ua.match(/msie|trident\/7|edge/);
let isWinPhone = ua.indexOf('windows phone') !== -1;
let isIOS = !isWinPhone && !!ua.match(/ipad|iphone|ipod/);
let searchStr = "";
let shortcuts = [];
let shortcutsMaxLength = 0;
const extendChar = '`';
const extendCharEsc = '`';

//([^\w|\b]|^)(the)([^\w|\b]|$)
function changeHighLight(a) {
    searchStr = new RegExp('(^\\w|\\b|^)(' + a + ')(^\\w|\\b|$)', "ig");
    // console.log(searchStr);
    handleInput();
    // window.scroll({top: 0, left: 0, behavior: 'smooth'});
    // $textarea.scrollTop(0);
}

function applyHighlights() {
    let text = $textarea.val();

    if (shortcuts) {
        shortcuts.forEach((item) => {
            if (item.abbr.indexOf(" ") != -1 || item.full.indexOf(" ") != -1) {
                console.log(extendChar + item.full + "==" + item.abbr + extendChar);
                text = text.replace(new RegExp(extendCharEsc + item.full + "==" + item.abbr + extendCharEsc, "g"), '<mark class="equalequal">' + extendChar + item.full + "==" + item.abbr + extendChar + '</mark>');
            } else {
                console.log(item.full + "==" + item.abbr);

                text = text.replace(new RegExp(item.full + "==" + item.abbr, "g"), '<mark class="equalequal">' + item.full + "==" + item.abbr + '</mark>');
            }
            text = text.replace(new RegExp('(^\\w|\\b|^)(' + item.full + ')(^\\w|\\b|$)', "ig"), '<mark class="at">' + item.full + '</mark>');

        });
    }


    text = text
        .replace(/\n$/g, '\n\n')
        .replace(new RegExp('\\*(\\w+)', "ig"), '<mark class="slash">$&</mark>')
        .replace(new RegExp('@(\\w+)', "ig"), '<mark class="at">$&</mark>')
        .replace(new RegExp('-(\\w+)', "ig"), '<mark class="dash">$&</mark>')
        .replace(new RegExp('(\\w+)\\?\\?', "ig"), '<mark class="question">$&</mark>')
    // .replace(new RegExp('(\\.)(.*)==(.*)(\\.)?', "ig"), '<mark class="equalequal">$&</mark>')


    // console.log('(^\\w|\\b|^)\\\/(\\w)*(^\\w|\\b|$)');
    if (searchStr !== "") {
        text = text
            .replace(searchStr, '<mark class="search">$&</mark>');
    }


    if (isIE) {
        // IE wraps whitespace differently in a div vs textarea, this fixes it
        text = text.replace(/ /g, ' <wbr>');
    }
    return text;
}


function replaceShortcuts() {
    if (shortcuts.length > 0) {
        console.log("running shortcuts");
        let text = $textarea.val();
        let cursorPos = $textarea.prop("selectionEnd");
        console.log("Is it ==? :'" + text.substring(cursorPos - shortcutsMaxLength - 2, cursorPos - shortcutsMaxLength - 0) + "'")
        if (text.substring(cursorPos - shortcutsMaxLength - 2, cursorPos - shortcutsMaxLength - 0) == "==") {
            return;
        }
        let findStr = text.substring(cursorPos - shortcutsMaxLength, cursorPos);
        console.log("findStr " + findStr);
        // alert(findStr)
        if (shortcuts) {
            shortcuts.forEach((item) => {
                console.log("item length", item.abbr.length);
                console.log("index", findStr.lastIndexOf(item.abbr));
                console.log("shortcutsMaxLength", shortcutsMaxLength);
                if (item.abbr.length + findStr.lastIndexOf(item.abbr) == shortcutsMaxLength) {
                    text = setCharAt(text, cursorPos - item.abbr.length, item.abbr.length, item.full);
                    $textarea.val(text);
                    $textarea.selectRange(cursorPos - item.abbr.length + item.full.length + 1);
                    return true;
                }
            });
        }
        return false;
        // let i;
        // for (i = cursorPos - 1; i > 0; i--) {
        //     if (text.substring(i, i + 1).match(new RegExp('[^\\w]', "ig"))) {
        //         break;
        //     }
        // }

        // if (i - 1 >= 0) { //a chance it's the declearation
        //     console.log(text.substring(i - 1, i + 1));
        //     if (text.substring(i - 1, i + 1) == "==") {
        //         return; // this is the declearation, do not replace
        //     }
        // }
        // let theWord = text.substring(i + 1, cursorPos);
        // console.log("i:", i, "cursor", cursorPos);

        // console.log("theWord:", theWord);
        // shortcuts.forEach((item) => {
        //     if (theWord == item.abbr) {
        //         text = setCharAt(text, cursorPos - theWord.length, theWord.length, item.full);
        //         // text=text.replace(new RegExp('([^=])(' + item.abbr + ')(\\b)', "ig"),"$1"+item.full+"$3");
        //         console.log(item);
        //         console.log(text);
        //         $textarea.val(text);
        //         $textarea.selectRange(cursorPos - item.abbr.length + item.full.length + 1);
        //         return;
        //     }
        // });
    }

}

function setCharAt(str, index, delDgts, insertStr) {
    if (index > str.length - 1) return str;
    return str.substr(0, index) + insertStr + str.substr(index + delDgts);
}

function handleInput() {
    let highlightedText = applyHighlights();
    console.log(highlightedText);
    $highlights.html(highlightedText);
    // count();
}

function handleScroll() {
    let scrollTop = $textarea.scrollTop();
    $backdrop.scrollTop(scrollTop);

    let scrollLeft = $textarea.scrollLeft();
    $backdrop.scrollLeft(scrollLeft);
}

function fixIOS() {
    // iOS adds 3px of (unremovable) padding to the left and right of a textarea, so adjust highlights div to match
    $highlights.css({
        'padding-left': '+=3px',
        'padding-right': '+=3px'
    });
}

function bindEvents() {
    $textarea.on({
        'scroll': handleScroll
    });

    $toggle.on('click', function () {
        count();
    });

    $("#genExp").on('click', function () {
        exportWithoutMarks();
    });
}

if (isIOS) {
    fixIOS();
}


function count() {
    let t = $("textarea").val();

    t = t.toLowerCase();
    t = t.replace(/[^\w\s]/g, '');

    let a = t.split(/\s/);
    a = a.filter(item => (item));

    let res = [];

    a.forEach((item) => {
        let found = false;
        for (let i = 0; i < res.length; i++) {
            if (res[i].key === item) {
                res[i].value += 1;
                found = true;
                break;
            }
        }
        if (!found) {
            res.push({key: item, value: 1});
        }
    });

    //sort with the number of occurance at first priority, if occures same times, sort alphabetically
    res.sort((a, b) => ((b.value - a.value) + ((b.key < a.key) ? .1 : -.1)));

    let print = "<table id='table1'><tr onclick='clearHighlight()'><th>Word (" + res.length.toString() + ")  </th><th style='vertical-align: center;'>Count</th><tr>";
    res.forEach((item) => {
        print += `<tr onclick="changeHighLight('${item.key}')"><td>${item.key}</td><td style="text-align: center;">${item.value}</td></tr>`;
    });
    print += "</table>";

    $("#res").html(print);
}

function resize() {
    document.getElementById("myTextarea").rows = document.getElementsByClassName("backdrop").s;
    document.getElementById("myTextarea").rows = "10";
}

function filter() {
    let
        input = document.getElementById("search"),
        filter = input.value.toLowerCase(),
        table = document.getElementById("table1"),
        tr = table.getElementsByTagName("tr");
    for (let i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            if (td.innerHTML.toLowerCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

function clearHighlight() {
    searchStr = "";
    handleInput()
}

bindEvents();
handleInput();


function parseShortcuts() {
    let t = $textarea.val();
    // console.log("raw string", t);
    let matches = t.match(new RegExp('(' + extendCharEsc + ')(.*)==(.*)(' + extendCharEsc + ')', "ig"));
    console.log(matches);
    let singleWordMatches = t.match(new RegExp('(\\w+)==(\\w+)', "ig"));
    console.log(singleWordMatches);

    if (matches != null) {
        for (let i = 0; i < matches.length; i++) {
            matches[i] = matches[i].substring(1, matches[i].length - 1);
        }
        console.log(matches);

        if (singleWordMatches != null) {
            singleWordMatches.forEach((single) => {
                let alreadyHave = false;
                matches.forEach((mult) => {
                    if (mult.match(new RegExp(single))) {
                        alreadyHave = true;
                    }
                });
                if (!alreadyHave) {
                    matches.push(single);
                    return;
                }
            });
        }
    } else {
        matches = t.match(new RegExp('(\\w+)==(\\w+)', "ig"));
    }
    shortcuts = [];
    if (matches != null) {
        matches.forEach((item) => {
            let foo = item.split("==");
            shortcuts.push({full: foo[0], abbr: foo[1]});
        });
    }
    updateShortcutsMaxLength();
    console.log(shortcuts);
}

$.fn.selectRange = function (start, end) {
    if (end === undefined) {
        end = start;
    }
    return this.each(function () {
        if ('selectionStart' in this) {
            this.selectionStart = start;
            this.selectionEnd = end;
        } else if (this.setSelectionRange) {
            this.setSelectionRange(start, end);
        } else if (this.createTextRange) {
            var range = this.createTextRange();
            range.collapse(true);
            range.moveEnd('character', end);
            range.moveStart('character', start);
            range.select();
        }
    });
};

function keyDown(e) {
    var code = (e.keyCode ? e.keyCode : e.which);
    if (code == 9) {
        e.preventDefault();
    }
}

function keyUp(e) {
    // console.log(e);
    var code = (e.keyCode ? e.keyCode : e.which);
    if (code == 9) {
        parseShortcuts();
        replaceShortcuts()
    }

    if (!pending) {
        pending = true;
        setTimeout(function () {
            pending = false;
            parseShortcuts();
            handleInput();
        }, 20);
    }
}

function exportWithoutMarks() {
    let original = $textarea.val();
    let deledMarks = original.replace(new RegExp(`==(\\w)+`, "ig"), "");
    let exportDiv = $("#exportT");
    exportDiv.val(deledMarks);
    console.log(deledMarks);
    exportDiv.select();
    document.execCommand("Copy");
    alert("Copied!");
}

function updateShortcutsMaxLength() {
    if (shortcuts) {
        shortcuts.forEach((item) => {
            if (item.abbr.length > shortcutsMaxLength) {
                shortcutsMaxLength = item.abbr.length;
            }
        });
    }
}

function tab(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}
