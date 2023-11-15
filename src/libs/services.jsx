import { decript, encript } from "./functions"



const login = (obj)=>{
	return fetchRequest({
		url:'/auth/login',
		body: obj,
		method: 'POST'
	});
}