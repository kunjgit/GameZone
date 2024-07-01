/**
 * Handler de menu 
 *
 * Il gère l'affichage et les actions utilisateur, mais pas le positionnement
 * des éléments de menu, ni leur arrivée à l'écran.
 *  - les flèches haut et bas déplacent la sélection
 *  - espace et entrée valident la sélection
 *  - escape sélectionne et valide une option définie par l'écran utilisateur
 *
 * Il est destiné à être encapsulé dans un écran qui gèrera ces éléments.
 */

 /**
  * Création du gestionnaire du menu, hors la partie graphique
  *  - container : l'objet DIV qui contiendra les éléments DHTML créés
  *  - fader : le fader sur le container (état In, i.e. affichage normal, en entrée)
  *  - imageFx : l'outil pour effectuer les opérations graphiques (texte détouré)
  *  - count : le nombre d'entrées dans le menu
  * 
  */
 function MenuDriver(controls, soundManager)
 {
	this.controls = controls;
	this.soundManager = soundManager;
	this.optionCount = 5;
	this.active = false;
 }
 
 
  MenuDriver.prototype = {
  
  
    /**
	 * Initialization / remise à zéro des paramètres 
	 *  - premier élément de menu sélectionné
	 */
	initialize : function() {
		this.done=false;
		this.selectedOption = 0;
		this.controls.totalClear();
	},
	
	/**
	 * Renvoie l'index de l'option sélectionnée
	 */
	getSelectedOption : function() {
		return this.selectedOption;
	},
	

	processEvents : function() {
		this.selectedOption += (this.controls.controlUp&&this.selectedOption>0?-1:0)
								+(this.controls.controlDown&&this.selectedOption<this.optionCount-1?1:0);
		if (this.controls.areaClicked) {
			this.selectedOption = this.controls.areaClicked-1;
		}
		
		if (this.controls.controlFire) {
			switch(this.selectedOption) {
				case 1 :
					this.controls.toggleStance();
					break;
				case 2 :
					this.soundManager.toggleMusic();
					break;
				case 3 :
					this.soundManager.toggleSound();
					break;
				default :	
					this.done = true;
					this.active = false;
			}
		}
		this.controls.totalClear();
	}
	
	
}
	