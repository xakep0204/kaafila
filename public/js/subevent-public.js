$("#registereventconfirmmodal").modal({ onHidden: () => window.location.assign("/profile") });
$("#registerevent").on("click", () => registerPublicEvent());
$("#registereventm").on("click", () => registerPublicEvent());

async function registerPublicEvent() {
	$("#registerevent").addClass("loading");
	data = { name: registrationMeta.name }
	$.post(`/registration`, {data: JSON.stringify(data), subevent: registrationMeta.subevent}, (status) => {
		if (status == "OK") {
			$("#registereventconfirmmodal").modal("show");
		} else {
			console.log(status);
		}
	})
}

registrationMeta = {}
if (document.getElementById("registerevent")) {
	$.each(document.getElementById("registerevent").attributes,function(i,a){
		if (['id', 'class'].indexOf(a.name) === -1) { registrationMeta[a.name.slice(5)] = a.value }
	})
}