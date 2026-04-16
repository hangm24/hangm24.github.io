document.getElementById("myconsole").value = "Welcome to Mathscape";
const radiobtns = document.querySelectorAll("input[type=radio]");
const radiostate = new Array(radiobtns.length).fill(false);
const layerbottom = document.getElementById("layer-bottom");
const cvs = document.getElementById("cvs");
const ctx = cvs.getContext('2d');
const tday = Math.floor(Date.now()/86400000);
const rmd1 = ((tday % 24) + 24) % 24;
ctx.lineWidth = 7;
const maxHeight = 1080;
const maxWidth = 1860;
var mode = 0;
var isDrawing = false;
var lineWidth = 7;
var points = [];
var startX;
var startY;
var x, y;
var xlast, ylast;
var color = "#580D8B";
var currentSlide = 0;
var currentStep = 0;
var maxStep = 0;
const slidesHistory = [];
slidesHistory.push([]);

const requestIdleCallback = window.requestIdleCallback || function (fn) { setTimeout(fn, 1) };

document.getElementById("layer-bottom").style.display = "none";
document.getElementById("statebar").style.display = "none";

window.addEventListener("beforeunload", function (evt) {
	evt.preventDefault();
	evt.returnValue = "";
});

cvs.height = Math.ceil(Math.min(0.98*window.innerHeight,0.57*window.innerWidth));
cvs.width = Math.ceil(Math.min(1.72*window.innerHeight,0.986*window.innerWidth));

for (let cr = 0; cr < radiobtns.length; cr++) {
	radiobtns[cr].addEventListener('click', evt => {
		if (radiostate[cr] == true) {
			radiobtns[cr].checked = false;
			radiostate[cr] = false;
		} else {
			radiobtns[cr].checked = true;
			radiostate[cr] = true;
		}
	})

}


function runClock() {
	const clockvar = new Date();
	let h = clockvar.getHours();
	let m = clockvar.getMinutes();

	if ( (h === 15) && (m >= 55) && (m <= 59)) {
		h = checkTime(h);
		m = checkTime(m);
		let s = clockvar.getSeconds();
		s = checkTime(s);
		document.getElementById('displayclock').innerHTML =  h + ":" + m + ":" + s;
	} else if ( (h === 14) && (m >= 45) && (m <= 54)) {
		h = checkTime(h);
		m = checkTime(m);
		let s = clockvar.getSeconds();
		s = checkTime(s);
		document.getElementById('displayclock').innerHTML =  h + ":" + m + ":" + s;
	} else if ( (h === 13) && (m >= 5) && (m <= 9)) {
		h = checkTime(h);
		m = checkTime(m);
		let s = clockvar.getSeconds();
		s = checkTime(s);
		document.getElementById('displayclock').innerHTML =  h + ":" + m + ":" + s;
	} else if ( (h === 12) && (m >= 5) && (m <= 9)) {
		h = checkTime(h);
		m = checkTime(m);
		let s = clockvar.getSeconds();
		s = checkTime(s);
		document.getElementById('displayclock').innerHTML =  h + ":" + m + ":" + s;
	} else if ( (h === 10) && (m >= 45) && (m <= 49)) {
		h = checkTime(h);
		m = checkTime(m);
		let s = clockvar.getSeconds();
		s = checkTime(s);
		document.getElementById('displayclock').innerHTML =  h + ":" + m + ":" + s;
	} else if ( (h === 9) && (m >= 45) && (m <= 49)) {
		h = checkTime(h);
		m = checkTime(m);
		let s = clockvar.getSeconds();
		s = checkTime(s);
		document.getElementById('displayclock').innerHTML =  h + ":" + m + ":" + s;
	} else if ( (h == 8) && (m >= 45) && (m <= 49)) {
		h = checkTime(h);
		m = checkTime(m);
		let s = clockvar.getSeconds();
		s = checkTime(s);
		document.getElementById('displayclock').innerHTML =  h + ":" + m + ":" + s;
	} else {
		h = checkTime(h);
		m = checkTime(m);
		document.getElementById('displayclock').innerHTML =  h + ":" + m ;
	}
	setTimeout(runClock, 1000);
}

function checkTime(i) {
	if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
	return i;
}

function getUpChar(charrmd) {
	let upchar = "";
	if (charrmd <= 8 ) {
		upchar = String.fromCharCode(65 + charrmd);
	} else if (charrmd <= 13){
		upchar = String.fromCharCode(66 + charrmd);
	} else {
		upchar = String.fromCharCode(67 + charrmd);
	}
	return upchar;
}

function getLowChar(charrmd) {
	let lowchar = "";
	if (charrmd <= 11 ) {
		lowchar = String.fromCharCode(122 - charrmd);
	} else if (charrmd <= 13){
		lowchar = String.fromCharCode(121 - charrmd);
	} else {
		lowchar = String.fromCharCode(120 - charrmd);
	}
	return lowchar;
}

function showAns(obj) {
	obj.parentElement.getElementsByTagName("output")[0].style.display = "inline";
	obj.style.display = "none";
}

function tagIn(txt) {
	const rmd2 = ((tday % 10) + 10) % 10;
	const pcd1 = getLowChar((7*rmd1)%24) + getUpChar((5*rmd1)%24);
	const pcd2 = rmd2.toString() + getLowChar(rmd1);
	const pcd3 = getUpChar((rmd1+1)%24) + getLowChar(rmd2);
	if (txt === (pcd1+pcd2+pcd3)) {
		document.getElementById("layer-bottom").style.display = "grid";
		document.getElementById("statebar").style.display = "block";
		document.getElementById("import").disabled = false;
		document.getElementById("exportlog").disabled = false;
		document.getElementById("pencil").disabled = false;
		document.getElementById("highlighter").disabled = false;
		document.getElementById("palette").disabled = false;
		document.getElementById("lineWidthIn").disabled = false;
		document.getElementById("backwardbtn").disabled = false;
		document.getElementById("forwardbtn").disabled = false;
		document.getElementById("smoothen").disabled = false;
		document.getElementById("straighten").disabled = false;
		document.getElementById("undo").disabled = false;
		document.getElementById("clear").disabled = false;
		document.getElementById("stylusbtn").disabled = false;
		document.getElementById("stylusonly").disabled = false;
	}
}

function addSlide() {
	if (confirm("Add a new slide?")) {
		const newSlide = document.createElement("div");
		newSlide.classList.add("slide");
		newSlide.setAttribute("class", "slide");
		Array.from(document.getElementsByClassName("slide"))[currentSlide].parentNode.insertBefore(newSlide,Array.from(document.getElementsByClassName("slide"))[currentSlide+1]);
		Array.from(document.getElementsByClassName("slide")).splice(currentSlide+1,0,newSlide);
		Array.from(document.getElementsByClassName("slide"))[currentSlide].style.display = "none";
		Array.from(document.getElementsByClassName("slide"))[currentSlide+1].style.display = "grid";
		slidesHistory.splice(currentSlide+1,0,[]);
		currentSlide +=1;
		ctx.clearRect(0, 0, cvs.width, cvs.height);
		ctx.strokeStyle = document.getElementById("palette").value;
		ctx.lineWidth = document.getElementById("lineWidthIn").value;
		currentStep = 0;
		maxStep = 0;
	}
}

function forward(){
	if (currentStep < maxStep) {
		Array.from(document.getElementsByClassName("slide"))[currentSlide].childNodes.forEach(elderNode => {
		if (elderNode.nodeType === 1){
				elderNode.childNodes.forEach(childNode => {
					if (childNode.nodeType === 1) {
						if (currentStep === parseInt(childNode.dataset.step)-1) childNode.style.display = "";
					}
				})
			}
		})
		currentStep += 1;
	} else if (currentSlide < Array.from(document.getElementsByClassName("slide")).length - 1) {
		Array.from(document.getElementsByClassName("slide"))[currentSlide].style.display = "none";
		Array.from(document.getElementsByClassName("slide"))[currentSlide+1].style.display = "grid";
		currentSlide +=1;
		currentStep = 0;
		maxStep = 0;
		ctx.clearRect(0, 0, cvs.width, cvs.height);
		for (let cc = 0; cc < slidesHistory[currentSlide].length; cc++) {
			ctx.strokeStyle = slidesHistory[currentSlide][cc].color;
			ctx.lineWidth = slidesHistory[currentSlide][cc].lineWidth;
			if (slidesHistory[currentSlide][cc].penType === 2) {
				ctx.globalAlpha = 0.3;
				ctx.lineCap = 'butt'
				ctx.lineJoin = 'bevel'
			} else {
				ctx.globalAlpha = 1;
				ctx.lineCap = 'round'
				ctx.lineJoin = 'round'
			}
			ctx.beginPath();
			let strokePath = [];
			slidesHistory[currentSlide][cc].map(function (point) {
				strokePath.push(point)
				pencilDraw(strokePath)
			})
		}
		ctx.strokeStyle = document.getElementById("palette").value;
		ctx.lineWidth = document.getElementById("lineWidthIn").value;
		Array.from(document.getElementsByClassName("slide"))[currentSlide].childNodes.forEach(elderNode => {
			if (elderNode.nodeType === 1){
				elderNode.childNodes.forEach(childNode => {
					if (childNode.nodeType === 1) {
						maxStep = Math.max(maxStep,parseInt(childNode.dataset.step));
						if (parseInt(childNode.dataset.step) === 0) {
							childNode.style.display = "";
						} else {
							childNode.style.display = "none";
						}
					}
				})
			}
		})
	}
}

function backward() {
	if (currentStep > 0) {
		Array.from(document.getElementsByClassName("slide"))[currentSlide].childNodes.forEach(elderNode => {
			if (elderNode.nodeType === 1){
				elderNode.childNodes.forEach(childNode => {
					if (currentStep === parseInt(elderNode.dataset.step)) childNode.style.display = "none";
					if (childNode.nodeType === 1) {
						if (currentStep === parseInt(childNode.dataset.step)) childNode.style.display = "none";
					}
				})
			}
		})
		currentStep -= 1;
	} else if (currentSlide > 0) {
		Array.from(document.getElementsByClassName("slide"))[currentSlide].style.display = "none";
		Array.from(document.getElementsByClassName("slide"))[currentSlide-1].style.display = "grid";
		currentSlide -=1;
		maxStep = 0;
		ctx.clearRect(0, 0, cvs.width, cvs.height);
		for (let cc = 0; cc < slidesHistory[currentSlide].length; cc++) {
			ctx.strokeStyle = slidesHistory[currentSlide][cc].color;
			ctx.lineWidth = slidesHistory[currentSlide][cc].lineWidth;
			if (slidesHistory[currentSlide][cc].penType === 2) {
				ctx.globalAlpha = 0.3;
				ctx.lineCap = 'butt'
				ctx.lineJoin = 'bevel'
			} else {
				ctx.globalAlpha = 1;
				ctx.lineCap = 'round'
				ctx.lineJoin = 'round'
			}
			ctx.beginPath();
			let strokePath = [];
			slidesHistory[currentSlide][cc].map(function (point) {
				strokePath.push(point)
				pencilDraw(strokePath)
			})
		}
		ctx.strokeStyle = document.getElementById("palette").value;
		ctx.lineWidth = document.getElementById("lineWidthIn").value;
		Array.from(document.getElementsByClassName("slide"))[currentSlide].childNodes.forEach(elderNode => {
			if (elderNode.nodeType === 1){
				elderNode.childNodes.forEach(childNode => {
					if (childNode.nodeType === 1) {
						maxStep = Math.max(maxStep,parseInt(childNode.dataset.step));
						childNode.style.display = "";
					}
				})
			}
		})
		currentStep = maxStep;
	}
}

function firstSlide() {
	if (currentSlide > 0) {
		Array.from(document.getElementsByClassName("slide"))[currentSlide].style.display = "none";
		Array.from(document.getElementsByClassName("slide"))[0].style.display = "grid";
		currentSlide =0;
		maxStep = 0;
		currentStep = 0;
		Array.from(document.getElementsByClassName("slide"))[0].childNodes.forEach(elderNode => {
			if (elderNode.nodeType === 1){
				elderNode.childNodes.forEach(childNode => {
					if (childNode.nodeType === 1) {
						maxStep = Math.max(maxStep,parseInt(childNode.dataset.step));
						if (parseInt(childNode.dataset.step) === 0) {
							childNode.style.display = "";
						} else {
							childNode.style.display = "none";
						}
					}
				})
			}
		})
	}
}

function lastSlide () {
	if (currentSlide < Array.from(document.getElementsByClassName("slide")).length - 1) {
		Array.from(document.getElementsByClassName("slide"))[currentSlide].style.display = "none";
		Array.from(document.getElementsByClassName("slide"))[Array.from(document.getElementsByClassName("slide")).length - 1].style.display = "grid";
		currentSlide = Array.from(document.getElementsByClassName("slide")).length - 1;
		maxStep = 0;
		Array.from(document.getElementsByClassName("slide"))[Array.from(document.getElementsByClassName("slide")).length - 1].childNodes.forEach(elderNode => {
			if (elderNode.nodeType === 1){
				elderNode.childNodes.forEach(childNode => {
					if (childNode.nodeType === 1) {
						maxStep = Math.max(maxStep,parseInt(childNode.dataset.step));
						childNode.style.display = "";
					}
				})
			}
		})
		currentStep = maxStep;
	}
}

function pencilDraw (stroke) {
	const l = stroke.length - 1
	if (stroke.length >= 3) {
		const xc = (stroke[l].x + stroke[l - 1].x) / 2
		const yc = (stroke[l].y + stroke[l - 1].y) / 2
		ctx.lineWidth = stroke[l - 1].lineWidth
		ctx.strokeStyle = stroke[l - 1].color;
		if (stroke[l - 1].penType === 2) {
			ctx.globalAlpha = 0.3;
			ctx.lineCap = 'butt'
			ctx.lineJoin = 'bevel'
		} else {
			ctx.globalAlpha = 1;
			ctx.lineCap = 'round'
			ctx.lineJoin = 'round'
		}
		ctx.quadraticCurveTo(stroke[l - 1].x, stroke[l - 1].y, xc, yc)
		ctx.stroke()
		ctx.beginPath()
		ctx.moveTo(xc, yc)
	} else {
		const point = stroke[l];
		ctx.lineWidth = point.lineWidth;
		ctx.strokeStyle = point.color;
		if (point.penType === 2) {
			ctx.globalAlpha = 0.3;
			ctx.lineCap = 'butt'
			ctx.lineJoin = 'bevel'
		} else {
			ctx.globalAlpha = 1;
			ctx.lineCap = 'round'
			ctx.lineJoin = 'round'
		}
		ctx.beginPath();
		ctx.moveTo(point.x, point.y);
		ctx.stroke();
	}
}

window.addEventListener("keyup", evt => {
	if (evt.keyCode === 13){
		if (evt.target.id === "commandline") {
			if (evt.target.value.startsWith("::showconsole")){
				document.getElementById("myconsole").style.display = "block";
			} else if (evt.target.value.startsWith("::hideconsole")){
				document.getElementById("myconsole").style.display = "none";
			} else if (evt.target.value.startsWith("::showstate")){
				document.getElementById("statebar").style.display = "block";
			} else if (evt.target.value.startsWith("::hidestate")){
				document.getElementById("statebar").style.display = "none";
			} else if (evt.target.value.startsWith("::super")){
				if (evt.target.value.split(' ')[1].startsWith(getLowChar((7*rmd1)%24) + getUpChar((5*rmd1)%24))) tagIn(evt.target.value.split(' ')[1]);
			} else if (evt.target.value !== "") {
				document.getElementById("myconsole").value = document.getElementById("myconsole").value + "\nMr Hang: " + evt.target.value;
			}
			document.getElementById("myconsole").scrollTop = document.getElementById("myconsole").scrollHeight;
			evt.target.value = "";
			evt.target.blur();
		} else if(evt.target.id === "lineWidthIn") {
			let input = parseInt(evt.target.value);
			if (isNaN(evt.target.value)) {
				evt.target.value = ctx.lineWidth;
			} else {
				ctx.lineWidth = input;
			}
			evt.target.blur();
    		}
		else {
			document.getElementById("commandline").focus();
		}
	} else if (evt.keyCode === 223){
		if (document.getElementById("myconsole").style.display == "block") {
			document.getElementById("myconsole").style.display = "none";
		} else {
			document.getElementById("myconsole").scrollTop = document.getElementById("myconsole").scrollHeight;
			document.getElementById("myconsole").style.display = "block";
		}
	}	
	if (evt.keyCode === 107){
		addSlide();
	}	
	if ([34,39,40].includes(evt.keyCode)){
		forward();
	}
	if ([33,37,38].includes(evt.keyCode)){
		backward();
	}
	if (evt.keyCode === 36){
		firstSlide();
	}	
	if (evt.keyCode === 35){
		lastSlide();
	}

});

myconsole.addEventListener("focusin", evt => {
	evt.target.blur();
});

rawdata.addEventListener("change", function (e) {
	const file = event.target.files[0];
	var reader = new FileReader();

	reader.addEventListener("load", () => {
		if (reader.result.includes("<!--SLIDE-->")){
			let slidesdata = reader.result.slice(reader.result.indexOf("<!--SLIDE 00-->"),reader.result.indexOf("<!--THE END-->"));
			slidesdata = slidesdata.replaceAll("<span class=\"ltfr\">","<span class=\"ltfr\">ƒ");
			slidesdata = slidesdata.replaceAll("<span class=\"ltx\">","<span class=\"ltx\">ƒ");
			slidesdata = slidesdata.replaceAll("</span>","ƒ</span>");
			layerbottom.innerHTML = slidesdata;
			MathJax.typeset();
			for (let cd = 1; cd < Array.from(document.getElementsByClassName("slide")).length; cd++) {
				slidesHistory.push([]);
			}
			Array.from(document.getElementsByClassName("slide"))[0].style.display = "grid";
			Array.from(document.getElementsByClassName("slide"))[0].childNodes.forEach(elderNode => {
				if (elderNode.nodeType === 1){
					elderNode.childNodes.forEach(childNode => {
						if (childNode.nodeType === 1) {
							maxStep = Math.max(maxStep,parseInt(childNode.dataset.step));
							if (parseInt(childNode.dataset.step) === 0) {
								childNode.style.display = "";
							} else {
								childNode.style.display = "none";
							}
						}
					})
				}
			})

		} else if (reader.result.includes("<!--STARTERSLIDE-->")){
			let slidesdata = reader.result.slice(reader.result.indexOf("<!--SLIDE 00-->"),reader.result.indexOf("<!--THE END-->"));
			slidesdata = slidesdata.replaceAll("<span class=\"ltfr\">","<span class=\"ltfr\">ƒ");
			slidesdata = slidesdata.replaceAll("<span class=\"ltx\">","<span class=\"ltx\">ƒ");
			slidesdata = slidesdata.replaceAll("</span>","ƒ</span>");
			layerbottom.innerHTML = slidesdata;
			MathJax.typeset();
			Array.from(document.getElementsByClassName("slide"))[0].style.display = "grid";
		} 
	});

	if (file) {
		reader.readAsText(file);
	}
});

navbar.addEventListener('change', evt => {

    if(evt.target.id === "lineWidthIn") {
		let input = parseInt(evt.target.value);
		if (isNaN(input)) {
			evt.target.value = ctx.lineWidth;
		} else {
			ctx.lineWidth = input;
		}
    }
    
});

navbar.addEventListener('click', evt => {
	if (evt.target.id === 'hand') {
		mode = 0;
		document.getElementById("drawing-board").inert = true;
		document.getElementById("hand").disabled = true;
		document.getElementById("pencil").disabled = false;
		document.getElementById("highlighter").disabled = false;
	}
	if (evt.target.id === 'pencil') {
		mode = 1;
		document.getElementById("drawing-board").inert = false;
		document.getElementById("hand").disabled = false;
		document.getElementById("pencil").disabled = true;
		document.getElementById("highlighter").disabled = false;
		document.getElementById("palette").value = "#580D8B";
		document.getElementById("lineWidthIn").value = 7;
	}
	if (evt.target.id === 'highlighter') {
		mode = 2;
		document.getElementById("drawing-board").inert = false;
		document.getElementById("hand").disabled = false;
		document.getElementById("pencil").disabled = false;
		document.getElementById("highlighter").disabled = true;
		document.getElementById("palette").value = "#89E485";
		document.getElementById("lineWidthIn").value = 60;
	}
	if (evt.target.id === "backwardbtn") {
		backward();
	}
	if (evt.target.id === "forwardbtn") {
		forward();
	}
	if (evt.target.id === 'stylusbtn') {
		document.getElementById("stylusonly").click();
	}
	if (evt.target.id === 'smoothen') {
		let oldHistory = [];
		let shid = slidesHistory[currentSlide].length - 1;
		let ptid = slidesHistory[currentSlide][shid].length;
		oldHistory = slidesHistory[currentSlide][shid].slice();
		for (let cb = 1; cb < slidesHistory[currentSlide][shid].length-1; cb++){
			slidesHistory[currentSlide][shid][cb].x = 0.4 * oldHistory[cb].x + 0.3 * oldHistory[cb-1].x + 0.3 * oldHistory[cb+1].x;
			slidesHistory[currentSlide][shid][cb].y = 0.4 * oldHistory[cb].y + 0.3 * oldHistory[cb-1].y + 0.3 * oldHistory[cb+1].y;
		}
		ctx.clearRect(0, 0, cvs.width, cvs.height);

		for (let cc = 0; cc < slidesHistory[currentSlide].length; cc++) {
			ctx.strokeStyle = slidesHistory[currentSlide][cc].color;
			ctx.lineWidth = slidesHistory[currentSlide][cc].lineWidth;
			switch (slidesHistory[currentSlide][cc].penType) {
				case 1:
					ctx.globalAlpha = 1;
					ctx.lineCap = 'round'
					ctx.lineJoin = 'round'
					break;
				case 2:
					ctx.globalAlpha = 0.3;
					ctx.lineCap = 'butt'
					ctx.lineJoin = 'bevel'
					break;
				default:
					return;
			}
			ctx.beginPath();
			let strokePath = [];
			slidesHistory[currentSlide][cc].map(function (point) {
				strokePath.push(point)
				pencilDraw(strokePath)
			})
		}
		ctx.strokeStyle = document.getElementById("palette").value;
		ctx.lineWidth = document.getElementById("lineWidthIn").value;
	}

	if (evt.target.id === 'straighten') {
		let shid = slidesHistory[currentSlide].length - 1;
		let ptid = slidesHistory[currentSlide][shid].length;
		for (let cb = 0; cb < slidesHistory[currentSlide][shid].length - 1; cb++){
			slidesHistory[currentSlide][shid][cb].x = (slidesHistory[currentSlide][shid][0].x * (ptid - cb) + slidesHistory[currentSlide][shid][ptid-1].x * cb)/ptid;
			slidesHistory[currentSlide][shid][cb].y = (slidesHistory[currentSlide][shid][0].y * (ptid - cb) + slidesHistory[currentSlide][shid][ptid-1].y * cb)/ptid;
		}

		ctx.clearRect(0, 0, cvs.width, cvs.height);

		for (let cc = 0; cc < slidesHistory[currentSlide].length; cc++) {
			ctx.strokeStyle = slidesHistory[currentSlide][cc].color;
			ctx.lineWidth = slidesHistory[currentSlide][cc].lineWidth;


			if (slidesHistory[currentSlide][cc].penType === 2) {
				ctx.globalAlpha = 0.3;
				ctx.lineCap = 'butt'
				ctx.lineJoin = 'bevel'
			} else {
				ctx.globalAlpha = 1;
				ctx.lineCap = 'round'
				ctx.lineJoin = 'round'
			}

			ctx.beginPath();
			let strokePath = [];
			slidesHistory[currentSlide][cc].map(function (point) {
				strokePath.push(point)
				pencilDraw(strokePath)
			})
		}
		ctx.strokeStyle = document.getElementById("palette").value;
		ctx.lineWidth = document.getElementById("lineWidthIn").value;
	}

	if (evt.target.id === 'undo') {
		slidesHistory[currentSlide].pop();
		ctx.clearRect(0, 0, cvs.width, cvs.height);
		for (let cc = 0; cc < slidesHistory[currentSlide].length; cc++) {
			ctx.strokeStyle = slidesHistory[currentSlide][cc].color;
			ctx.lineWidth = slidesHistory[currentSlide][cc].lineWidth;
			if (slidesHistory[currentSlide][cc].penType === 2) {
				ctx.globalAlpha = 0.3;
				ctx.lineCap = 'butt'
				ctx.lineJoin = 'bevel'
			} else {
				ctx.globalAlpha = 1;
				ctx.lineCap = 'round'
				ctx.lineJoin = 'round'
			}
			ctx.beginPath();
			let strokePath = [];
			slidesHistory[currentSlide][cc].map(function (point) {
				strokePath.push(point)
				pencilDraw(strokePath)
			})
		}
		ctx.strokeStyle = document.getElementById("palette").value;
		ctx.lineWidth = document.getElementById("lineWidthIn").value;
	}
	if (evt.target.id === 'clear') {
		if (confirm("Are you sure to clear the canvas?") === true) {
			slidesHistory[currentSlide].length = 0;
			ctx.clearRect(0, 0, cvs.width, cvs.height);
		}
	}
});



window.addEventListener('resize', evt => {
	let xfactor = Math.ceil(Math.min(1.72*window.innerHeight,0.986*window.innerWidth))/cvs.width
	let yfactor = Math.ceil(Math.min(0.98*window.innerHeight,0.57*window.innerWidth))/cvs.height;
	cvs.width = Math.ceil(Math.min(1.72*window.innerHeight,0.986*window.innerWidth));
	cvs.height = Math.ceil(Math.min(0.98*window.innerHeight,0.57*window.innerWidth));
	for (let cd = 0;  cd < slidesHistory.length; cd++) {
		for (let cc = 0; cc < slidesHistory[cd].length; cc++) {
			if (cd === currentSlide){
				ctx.strokeStyle = slidesHistory[cd][cc].color;
				ctx.beginPath(); 
				let strokePath = []; 
				if (slidesHistory[cd][cc].penType === 2) {
					ctx.globalAlpha = 0.3;
					ctx.lineCap = 'butt'
					ctx.lineJoin = 'bevel'
				} else {
					ctx.globalAlpha = 1;
					ctx.lineCap = 'round'
					ctx.lineJoin = 'round'
				}
				slidesHistory[cd][cc].map(function (point) {
					point.x = point.x*xfactor;
					point.y = point.y*yfactor;
					strokePath.push(point)
					pencilDraw(strokePath)
				})
			} else {
				slidesHistory[cd][cc].map(function (point) {
					point.x = point.x*xfactor;
					point.y = point.y*yfactor;
				})
			}
		}
	}
	ctx.strokeStyle = document.getElementById("palette").value;
	ctx.lineWidth = document.getElementById("lineWidthIn").value;
});

for (const e of ["touchstart", "mousedown"]) {
	cvs.addEventListener(e, function (evt) {
		if (mode == 0) return;
		if (document.getElementById("stylusonly").checked){
			if (e.touches[0].touchType === 'direct') {
				return;
			}
			if (e.touches[0].radiusX != 0 && e.touches[0].radiusY != 0){
				return;
			}
		}
		ctx.strokeStyle = document.getElementById("palette").value;
		ctx.lineWidth = document.getElementById("lineWidthIn").value;
		switch(mode) {
			case 1:
				ctx.globalAlpha = 1;
				ctx.lineCap = 'round'
				ctx.lineJoin = 'round'
				break;
			case 2:
				ctx.globalAlpha = 0.3;
				ctx.lineCap = 'butt'
				ctx.lineJoin = 'bevel'
				break;
			default:
				return;
		}
		if (evt.touches && evt.touches[0] && typeof evt.touches[0]["force"] === "direct") {
		//Using Touch or Stylus
			x = evt.touches[0].clientX - cvs.offsetLeft
			y = evt.touches[0].clientY
		} else {
		// Using Mouse
			x = evt.clientX - cvs.offsetLeft
			y = evt.clientY
		}
		isDrawing = true;
		penType = mode;
		color = document.getElementById("palette").value;
		lineWidth = document.getElementById("lineWidthIn").value;
		points.push({ x, y, lineWidth, color, penType})
		pencilDraw(points)
	})
}

for (const e of ['touchmove', 'mousemove']) {
	cvs.addEventListener(e, function (evt) {
		if (mode == 0) return;
		if (!isDrawing) return;
		if (document.getElementById("stylusonly").checked === true){
			if (evt.touches && evt.touches[0] && typeof evt.touches[0]["force"] !== "undefined"){
				if (touch.touchType !== 'stylus'){
					return; //Return if direct touch
				}
			} else {
				return; //Return if mouse
			}
		}
		evt.preventDefault()
		if (evt.touches && e.touches[0] && typeof evt.touches[0]["force"] !== "undefined") {
			//Using Touch or Stylus
			x = evt.touches[0].clientX - cvs.offsetLeft
			y = evt.touches[0].clientY
		} else {
			//Using Mouse
			x = evt.clientX - cvs.offsetLeft
			y = evt.clientY
		}
		// smoothen line width
		penType = mode;
		points.push({ x, y, lineWidth, color , penType})
		pencilDraw(points);
		xlast = x;
		ylast = y;
	})
}

for (const e of ['touchend', 'touchleave', 'mouseup', 'mouseleave']) {
	cvs.addEventListener(e, function (evt) {
		if (mode == 0) return;
		if (!isDrawing) return;
		if (evt.touches && evt.touches[0] && typeof evt.touches[0]["force"] !== "undefined") {
			//Using Touch or Stylus
			x = evt.touches[0].clientX - cvs.offsetLeft
			y = evt.touches[0].clientY
		} else {
			//Using Mouse
			x = evt.clientX - cvs.offsetLeft
			y = evt.clientY
		}
		isDrawing = false;
		requestIdleCallback(function () { slidesHistory[currentSlide].push([...points]); points = []});
	})
};