export const isValidForm = (element)=>{
    var ctrls = [];
		const select = document.querySelector(element);
		
		if(select !== null){
			ctrls = select.querySelectorAll('input, select');
			
			let isFormValid = true;
			ctrls.forEach(ctrl => {
				if(ctrl.required){
					const isInputValid = showCtrlError(ctrl.id);

					if (!isInputValid) {
						isFormValid = false;
					}
				}
			});
		
			return isFormValid;
		}

		return true;  

	};

  const showCtrlError = (id)=>{
		var res = null;
		var control = document.getElementById(id);

		if(control !== null){
			if (control.value.trim() === "") {
				if(control !== null){
					//control.classList.add('error');
				}
				res = false;
			} else{
				if(control !== null){
					if(control.required && control.className.includes('error')){
						//control.classList.remove('error');
					}
				}
				res = true;
			}
		}
		return res;
	};