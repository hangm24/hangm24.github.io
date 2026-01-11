const radiobtns = document.querySelectorAll("input[type=radio]");
const radiostate = new Array(radiobtns.length).fill(false);
const checkboxes = document.querySelectorAll("input[type=checkbox]");
const checkboxstate = new Array(checkboxes.length).fill(1);
checkboxes.forEach(checkbox => (checkbox.indeterminate = true));

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

for (let cb = 0; cb < checkboxes.length; cb++) {
	checkboxes[cb].addEventListener('change', evt => {
		if (checkboxstate[cb] == 1) {
			checkboxes[cb].checked = true;
			checkboxstate[cb] = 2;
		} else if (checkboxstate[cb] == 2) {
			checkboxes[cb].checked = false;
			checkboxstate[cb] = 0;
		} else {
			checkboxes[cb].indeterminate = true;
			checkboxstate[cb] = 1;
		}
	})

}