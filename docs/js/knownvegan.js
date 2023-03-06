const pfeilTimeout = setTimeout(animationHelp, 2000); 
var rezeptListe = []; 
var currentRecipeList = []; 

/* Welche Filter (Checkbox Ids) gibt es */  
const filterDayTime = ["Breakfast", "Lunch", "Dinner", "All"]; 
const filterCountry = ["BG", "SN", "DE", "IS", "DK", "All"]; 
const filterLevel = ["Easy", "High", "Medium", "All"]; 

/* Welche Filter sind aktiv, erstmal alle */  
var currentFilterDayTime = filterDayTime; 
var currentFilterCountry = filterCountry; 
var currentFilterLevel = filterLevel; 

/* Kleine Hilfsfunktion, damit man nicht immer "document.querySelector()" tippen muss */ 
$=(selector) => {return document.querySelector(selector);} 

/* Alles erst starten, wenn der Browser mit dem Laden der Seite fertig ist */ 
window.addEventListener("load", start);

/* Hier gehts los: Für jede Checkbox dafür sorgen das eine Funktion aufgerufen wird, wenn Sie angeklickt wird */ 
function start() {
	$("#filterButton").addEventListener("click", listeEinblenden);
	$("#food").addEventListener("click", foodEinblenden); 
	$("body").addEventListener("click", animationStop); 
	filterDayTime.forEach(filterName => {
		$(`#filterDayTime${filterName}`).addEventListener("click",() => filterChangeDayTime(`${filterName}`));
	});
	filterLevel.forEach(filterName => {
		$(`#filterLevel${filterName}`).addEventListener("click", () => filterChangeLevel(`${filterName}`));
	});
	filterCountry.forEach(filterName => {
		$(`#filterCountry${filterName}`).addEventListener("click", () => filterChangeCountry(`${filterName}`));
	});
	/* Rezepte laden */
	rezepteLaden(); 
	/* Müssen Filter disabled (ausgegraut) werden */
	checkFilterState(); 
}

/* Ein Klick auf eine Checkbox aus der Kategorie DayTime ruft diese Funktion auf und übergibt den Filternamen als Parameter */ 
function filterChangeDayTime(id) {
	/* Wenn "Egal" angeklickt wird, einfach alle Filter setzen ... */ 
	if ($(`#filterDayTimeAll`).checked) {
		currentFilterDayTime = filterDayTime;
	}
	else {
		/* ... sonst alle Filter löschen ... */ 
		currentFilterDayTime = [];
		/* ... und alle angeklickten wieder aktivieren */ 
		filterDayTime.forEach((filterName) => {
			if ($(`#filterDayTime${filterName}`).checked) { currentFilterDayTime.push(filterName); }
		}); 
		/* Wenn alle Checkboxen leer, dann einfach die zuletzt angeklickte wieder aktivieren */ 
		if (currentFilterDayTime.length == 0) {
			$(`#filterDayTime${id}`).checked = true; 
			currentFilterDayTime.push(id); 
		}	
	}
	/* Wenn alle Checkboxen aktiviert, dann auch die Egal-Checkbox und alle Filter setzen */
	if ((currentFilterDayTime.length == 3) && (id != "All")) {
		$(`#filterDayTimeAll`).checked = true; 
		currentFilterDayTime = filterDayTime; 
	}
	/* Müssen Filter disabled (ausgegraut) werden */
	checkFilterState();
}

/* Siehe vorherige Funktion nur für die Level Kategorie */ 
function filterChangeLevel(id) {
	if ($(`#filterLevelAll`).checked) {
		currentFilterLevel = filterLevel;
	}
	else {
		currentFilterLevel = [];
		filterLevel.forEach((filterName) => {
			if ($(`#filterLevel${filterName}`).checked) { currentFilterLevel.push(filterName); }
		});
		if (currentFilterLevel.length == 0) {
			$(`#filterLevel${id}`).checked = true;
			currentFilterLevel.push(id);
		}
	}
	/* Wenn alle Checkboxen aktiviert, dann auch die Egal-Checkbox und alle Filter setzen */
	if ((currentFilterLevel.length == 3) && (id != "All")) {
		$(`#filterLevelAll`).checked = true;
		currentFilterLevel = filterLevel;
	}
	checkFilterState();
}

/* Siehe vorherige Funktion nur für die Country Kategorie */ 
function filterChangeCountry(id) {
	if ($(`#filterCountryAll`).checked) {
		currentFilterCountry = filterCountry;
	}
	else {
		currentFilterCountry = [];
		filterCountry.forEach((filterName) => {
			if ($(`#filterCountry${filterName}`).checked) { currentFilterCountry.push(filterName); }
		});
		if (currentFilterCountry.length == 0) {
			$(`#filterCountry${id}`).checked = true;
			currentFilterCountry.push(id);
		}
	}
	/* Wenn alle Checkboxen aktiviert, dann auch die Egal-Checkbox und alle Filter setzen */
	if ((currentFilterCountry.length == 5) && (id != "All")) {
		$(`#filterCountryAll`).checked = true;
		currentFilterCountry = filterCountry;
	}
	checkFilterState();
}

/* Hier wird gescheckt ob Checkboxen aktiviert/deaktiviert werden müssen, wird jedesmal wenn sich etwas ändert aufgerufen s. oben */ 
function checkFilterState() {
	filterDayTime.forEach(filterName => {
		if (filterName != "All") $(`#filterDayTime${filterName}`).disabled = $(`#filterDayTimeAll`).checked; 
	});  
	filterCountry.forEach(filterName => {
		if (filterName != "All") $(`#filterCountry${filterName}`).disabled = $(`#filterCountryAll`).checked;
	});
	filterLevel.forEach(filterName => {
		if (filterName != "All") $(`#filterLevel${filterName}`).disabled = $(`#filterLevelAll`).checked;
	});
	/* Da die Funktion immer aufgerufen wird, wenn sich an den Filtern etwas ändert, ist das die perfekte Stelle um zu filtern */
	filterRecipes(); 
}

/* Der Pfeil */ 
function animationHelp(){
	$("#hint").classList.add("animatedHintOn"); 
} 

function animationStop() {
	const pfeilCSS = $("#hint").classList;
	clearTimeout(pfeilTimeout); 
	if (pfeilCSS.contains("animatedHintOn")) {
		pfeilCSS.remove("animatedHintOn"); 
		pfeilCSS.add("animatedHintOff"); 
	}
}

function listeEinblenden() {
	classReset(); 
	document.getElementById('filterDropdown').click('close');
	$("#filterMenu").classList.add("strongDark"); 
	$("#listSection").classList.add("An");
	$("#mainSection").classList.add("Aus"); 
	$("#rezeptSection").classList.add("Aus"); 
}

function foodEinblenden() {
	classReset(); 
	$("#filterMenu").classList.add("strongDark"); 
	$("#listSection").classList.add("Aus");
	$("#mainSection").classList.add("Aus");
	$("#rezeptSection").classList.add("An");
	$("#viechers").classList.add("Aus");
}

function classReset() {
	$("#filterMenu").classList.remove("mediumDark");
	$("#filterMenu").classList.remove("strongDark");
	$("#listSection").classList.remove("An");
	$("#listSection").classList.remove("Aus");
	$("#mainSection").classList.remove("An");
	$("#mainSection").classList.remove("Aus");
	$("#rezeptSection").classList.remove("An");
	$("#rezeptSection").classList.remove("Aus");
	$("#viechers").classList.remove("Aus");
	$("#viechers").classList.remove("An");
}

function rezepteLaden() {
	fetch("data/rezepte.json")
		.then(function (response) { return response.json(); })
		.then(function (data) { rezeptListe = data; filterRecipes() })
		.catch(function (error) {
			console.log("error: " + error);
		});
}

function filterRecipes() {
	if (rezeptListe.length === 0) return;  

	currentRecipeList = rezeptListe.filter((recipe) =>
		recipe.filterCountry.some((Country) => currentFilterCountry.includes(Country)) &&
		recipe.filterLevel.some((Level) => currentFilterLevel.includes(Level)) &&
		recipe.filterDayTime.some((DayTime) => currentFilterDayTime.includes(DayTime)) 
	); 
	if (currentRecipeList.length > 0) {
		$("#filterButton").innerHTML = currentRecipeList.length + " Gericht" + ((currentRecipeList.length !== 1) ? "e" : "") + " anzeigen";
		$("#filterButton").disabled = false; 
	}
	else {
		$("#filterButton").innerHTML = "Nichts gefunden";
		$("#filterButton").disabled = true; 
	}
}

