# Live Match

LiveMatch est un plugin jQuery permettant d'executer de façon automatique une fonction callback à l'ajout d'un élément html au DOM.

Il agit sur les éléments déjà présents au chargement de la page et sur ceux ajoutés dynamiquement. 

LiveMatch se veut un remplacement du plugin [livequery](https://plugins.jquery.com/livequery).


## Méthodes

### `onMatch()`

La fonction permettant d’associer une fonction handler à un sélecteur.

```jsx
void onMatch( selector, handler );
```

### Paramètres

`selector`

Un sélecteur jQuery. 

`handler`

Une fonction handler exécutée sur les éléments correspondants au sélecteur.


## Exemple

Le code qui suit détecte dans le document tous les élément de type input qui possèdent la classe `readOnlyInput` et passe leur propriété `readonly` à `true`.

```jsx
jQuery.onMatch(":input.readonlyInput", function() {
    jQuery(this).prop("readonly", true);
});
```

#### Note : LiveMatch est également capable de détecter des correspondances lors de modifications plus subtiles comme les changements d’attributs.

Le code qui suit permet de visualiser cette fonctionnalité. 

On attribut une classe `readOnlyInput` aux éléments de type input déjà présent sur notre document. 

Lors de l’ajout de cette classe, une nouvelle correspondance est détectée via la méthode `.onMatch()` pour les inputs possédants la classe `readOnlyInput`.

La fonction `handler` associée est alors exécutée et la propriété `readonly` des inputs est passée à `true`.

```html
<input type="text"/>
<input type="text"/>
<input type="text"/>
```

```jsx
// Ajoute une class "readonlyInput" à tous les éléments de type inupt
jQuery("input").addclass("readonlyInput");

// Passe en true la propriété "readonly" des inputs possédants la classe "readonlyInput"
jQuery.onMatch(":input.readonlyInput", function() {
    jQuery(this).prop("readonly", true);
});
```

**Résultat :**

```html
<input type="text" class="readonlyInput" readonly=""/>
<input type="text" class="readonlyInput" readonly=""/>
<input type="text" class="readonlyInput" readonly=""/>
```

## Limitations

- LiveMatch ne permet pas l’appel d’une fonction handler lorsqu’un élément ne correspond plus à un sélecteur.

- Chaque fonction handler définie via la méthode `.onMatch()` ne s’exécute qu’une fois par élément.
Si un même élément correspond à nouveau à un sélecteur, sa fonction handler associée ne sera pas exécutée à nouveau.

    ```html
    <div></div>
    <div></div>
    ```

    ```jsx
    jQuery.onMatch(".myClass", function() {
        console.log("match!");
    });
    
    jQuery("div").addclass("myClass"); // console.log("match!"); est exécuté 2 fois
    jQuery("div").removeClass("myClass");
    jQuery("div").addclass("myClass"); // la fonction handler est ignorée
    ```

    **Console :**
    
    ```
    match!
    match!
    ```

## Spécificités

- La méthode `.onMatch()` s’applique uniquement sur l’objet global jQuery.

    ```jsx
    // Syntaxe VALIDE
    jQuery.onMatch(".myClass", handler);
    
    // Syntaxe INVALIDE
    jQuery(".myClass").onMatch(".myClass", handler);
    ```

## **Dépendances**

- [jQuery v1.7 +](https://releases.jquery.com/jquery/)
