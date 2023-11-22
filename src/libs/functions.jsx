import cryptoJs from 'crypto-js';
import Swal from 'sweetalert2';

const apiUrl = import.meta.env.VITE_HOST;
/**
 * Function general para llamar los servicios de api
 * @param {string | url} ruta de servicio a consultar
 * @param {string | method} method que utiliza el servicio (GET, POST, PUT, DELETE, PATCH)
 * @param {object | obj} json que contiene los datos de un formulario 
 * @param {bool | requireToken} bandera para verificar si se utiliza token o no, sirve para cuando se quiere 
 * 								consultar un servicio que necesita que el usuario este logeado
 * @param {bool | sendFile} bandera para verificar si se esta enviando un archivo (jpg, pdf) desde un formulario
 * 
 * @return {object | response} json de respuesta 
 * */
export const fetchRequest = ({
	url,
	method = 'GET',
	body = null,
	requireToken = true,
	sendFile = false
})=>{
	let token = decript('token');
	let headers = {
		'Content-Type'	: 'application/json',
		'Accept'		: 'application/json'
	};

	if(requireToken){
		headers = {
			'Authorization'	: 'Bearer '	+ token,
			'Content-Type'	: 'application/json',
			'Accept'		: 'application/json'
		}

		if(sendFile){
			headers = {
				'Authorization'	: 'Bearer ' + token,				
			}
		}
	}

	return fetch(apiUrl + url, {
		method: method,
		body: body !== null ? //verifica si la variable body es diferente de null
				sendFile ?  //verifica que el objeto contenga un archivo a enviar 
					body  //se envia el objeto
				:
					JSON.stringify(body) //se transforma el objeto a string
			: null, //no envia nada
		headers: new Headers( headers )
	}).then(res => {
        if(res.ok){
            return res.json();
        }else{
            res.text().then(msg => {
            	console.log(msg)
            });
        }
    }).then(response => {
        if(response){
            return response;
        }
    });
}

/*
* find variable in storage
* @param {string | name} variable's name
* @return string
*/
const findInStorage = (name)=>{
	let value = '';
	let sessions = Object.keys(sessionStorage);

	if(sessions.length > 0){
		sessions.forEach((key) => {
			let bytes = cryptoJs.AES.decrypt(key, import.meta.env.VITE_MANAGE);
			let decriptedName = bytes.toString(cryptoJs.enc.Utf8);

			if(decriptedName === name){
				value = key;
			}
		});
	}

	return value;
}

/*
* encrypt variable and save in sessionstorage from browser
* @param {string | name} variable's name
* @param {string | value} variable's value
*/
export const encript = (name, value)=>{
	let found = findInStorage(name);

	let encriptedValue = cryptoJs.AES.encrypt(value, import.meta.env.VITE_MANAGE);
	let encriptedName = cryptoJs.AES.encrypt(name, import.meta.env.VITE_MANAGE);

	if(found !== ''){
		encriptedName = found;
	}

	sessionStorage.setItem(encriptedName, encriptedValue);
}

/*
* get value of variable in storage
* @param {string | name} variable name
* @return string
*/
export const decript = (name)=>{
	let value = '';
	let sessions = Object.keys(sessionStorage);

	if(sessions.length > 0){
		sessions.forEach(key => {
			let bytes = cryptoJs.AES.decrypt(key, import.meta.env.VITE_MANAGE);
			let decriptedName = bytes.toString(cryptoJs.enc.Utf8);

			if(decriptedName === name){
				let encriptedValue = sessionStorage.getItem(key);            
				let bytesValue = cryptoJs.AES.decrypt(encriptedValue, import.meta.env.VITE_MANAGE);
				value = bytesValue.toString(cryptoJs.enc.Utf8);            
			}
		});
	}

	return value;
}


/*
* verify if user is authenticated
* return boolean
*/
export const isAuth = ()=>{
	let auth = false;

	let find = findInStorage('token');
	if(find !== ''){
		auth = true;
	}
    
    return auth;
}

/**
 * Verifica que el formulario este completo con los campos que son requeridos
 * @param {*} element identidicador de formulario ej div.class_name
 * @returns boolean
 */
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

/**
 * marca los elementos requeridos cuando el campo esta vacio
 * @param {*} id identificador de elemento
 * @returns boolean
 */
export const showCtrlError = (id)=>{
	var res = null;
	var control = document.getElementById(id);

	if(control !== null){
		if (control.value.trim() === "") {
	        if(control !== null){
	            control.classList.add('error');
	        }
			res = false;
		} else{
			if(control !== null){
				if(control.required && control.className.includes('error')){
		        	control.classList.remove('error');
		    	}
	    	}
			res = true;
		}
	}

	return res;
};

/**
 * Muestra modal de confirmacion para realizar alguna accion como por ejemplo eliminar un registro
 * @param {*} obj datos de variables
 */
export const swalAction = (obj)=>{
	Swal.fire({
		title 				: obj.title,
		text 				: obj.text,
		icon 				: obj.icon,
		showConfirmButton	: true,
		showCancelButton	: true,
		confirmButtonText	: obj.textConfirm,
		confirmButtonColor  : 'var(--rs-blue-500)',
		cancelButtonColor	: obj.colorCancel || 'var(--rs-red-500)',
		cancelButtonText	: obj.textcancel
	}).then(result => {
		if(result.isConfirmed){
			obj.fn(obj.values);
		}else{
			if(obj.fnCancel !== undefined){
				obj.fnCancel(obj.values);
			}
		}
	});
}