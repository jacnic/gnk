$(function(){
    initConfirm();

    initDeleteButton();

    initSearchBoxes();

    // ajout du nombre de relation
    $('.numberRelation').html($('.relationScreen .accordion-group:not(.leftRelation)').size());

    // charge les datetimepickers
    $('.datetimepicker').datetimepicker({
        language: 'fr',
        pickSeconds: false
    });

    stopClosingDropdown();

    initQuickObjects();

    initializeTextEditor();

    // on ajoute la description d'un plot dans le champ hidden correspondant
    $('.updatePlot').click(function() {
        if (($('.richTextEditor span.label-default').size() > 0) && ($('#isDraft:checked').size() == 0)) {
            createNotification("danger", "Enregistrement échoué.", "Votre intrigue comporte des éléments non enregistrés en base de données, enregistrez les ou passer l'intrigue en mode brouillon pour pouvoir continuer.");
            return false;
        }
        var form = $('.savePlotForm');
        var description = $('#plotRichTextEditor', form).html();
        description = transformDescription(description);
        $('.descriptionContent', form).val(description);
        var pitchOrga = $('#plotRichTextEditorPitchOrga', form).html();
        pitchOrga = transformDescription(pitchOrga);
        $('.pitchOrgaContent', form).val(pitchOrga);
        var pitchPj = $('#plotRichTextEditorPitchPj', form).html();
        pitchPj = transformDescription(pitchPj);
        $('.pitchPjContent', form).val(pitchPj);
        var pitchPnj = $('#plotRichTextEditorPitchPnj', form).html();
        pitchPnj = transformDescription(pitchPnj);
        $('.pitchPnjContent', form).val(pitchPnj);
        $.ajax({
            type: "POST",
            url: form.attr("data-url"),
            data: form.serialize(),
            dataType: "json",
            success: function(data) {
                if (data.object.isupdate) {
                    initializeTextEditor();
                    createNotification("success", "Modifications réussies.", "Votre intrigue a bien été modifiée.");

                }
                else {
                    createNotification("danger", "Modification échouée.", "Votre intrigue n'a pas pu être ajoutée, une erreur s'est produite.");
                }
            },
            error: function() {
                createNotification("danger", "Modification échouée.", "Votre intrigue n'a pas pu être ajoutée, une erreur s'est produite.");
            }
        })

    });

    // mode plein ecran
    $('.btnFullScreen').click(function() {
        $(this).parent().parent().toggleClass("fullScreenOpen");
    });

    bgenScroll();

    initModifyTag();

    //insert html span into textEditors
    $('.buttonRichTextEditor').click(function() {
        setCarretPos();
        if ($(this).closest("ul").hasClass("roleSelector")) {
            pasteHtmlAtCaret('<span class="label label-success" contenteditable="false" data-toggle="popover" data-original-title="Choix balise" title="">' + $(this).html() + '</span>');
        }
        else if ($(this).closest("ul").hasClass("placeSelector")) {
            pasteHtmlAtCaret('<span class="label label-warning" contenteditable="false" data-toggle="popover" data-original-title="Choix balise" title="">' + $(this).html() + '</span>');
        }
        else if ($(this).closest("ul").hasClass("resourceSelector")) {
            pasteHtmlAtCaret('<span class="label label-important" contenteditable="false" data-toggle="popover" data-original-title="Choix balise" title="">' + $(this).html() + '</span>');
        }
        var spanPopover = '<div class="specialTag"><button class="btn btn-small btn-primary">Article</button>' +
            '<button class="btn btn-small btn-primary">Nominatif</button></div>' +
            '<div class="specialTag"><button class="btn btn-small btn-primary">Particule</button>' +
            '<button class="btn btn-small btn-primary">Possessif</button></div>' +
            '<div class="specialTag"><button class="btn btn-danger btn-small">Aucune</button></div>';
        $('.label[contenteditable="false"]:not(.label-success)').popover({
            html: 'true',
            placement: 'top',
            content: spanPopover,
            container: "body"
        });
        return false;
    });
});

function initQuickObjects() {
    //permet d'ajouter rapidement une ressource, lieu ou role
    $(".leftMenuList input, .inputOther").keypress(function(e) {
        if(e.which == 13) {
            var entity = $(this).attr("data-entity");
            var badgeWarning = '<i class="icon-warning-sign"></i>';
            appendEntity(entity, $(this).val(), "default", badgeWarning);
            $(this).val('');
            return false;
        }
    });
}

// empeche les dropdown de se fermer lorsqu'on focus un input
function stopClosingDropdown() {
    $('.dropdown-menu input, .dropdown-menu label').click(function(e) {
        e.stopPropagation();
    });
}

//active le bouton "modifier" des fenêtres de tag
function initModifyTag() {
    $('.modifyTag').click(function() {
        if ($(this).hasClass("push")) {
            $('.modal-body li', $(this).parent().parent()).hide();
            $('.modal-body li input[type="checkbox"]:checked', $(this).parent().parent()).parent().parent().show();
            $('.modal-body li input[type="checkbox"]:checked', $(this).parent().parent()).parents("*").show();
        }
        else {
            $('.modal-body li', $(this).parent().parent()).show();
        }
        $(this).toggleClass("push");
        $(this).toggleClass("active");
    });
}

//Recherche de tags
function initSearchBoxes() {
    $('.search-query').keyup(function() {
        var content = $(this).attr("data-content");
        var value = $(this).val().toLowerCase();
        if (value == "") {
            $('.' + content + ' li').show();
        }
        else {
            $("." + content + " li").hide();
            var children = $('.' + content + ' li[data-name*="'+value+'"]');
            children.show();
            children.parents("*").show();
        }
    });
}

// initialise les popups de confirmation
function initConfirm() {
    $('[data-toggle="confirmation-popout"]').confirmation({
        popout: true,
        btnOkLabel: "Oui",
        btnCancelLabel: "Non",
        btnOkClass: "btn-success",
        btnCancelClass: "btn-danger",
        onConfirm:function() {
            var objectButton = $(this).closest("div.popover").prev()
            if (objectButton.attr("data-object") == "role") {
                removeRole(objectButton);
            }
            if (objectButton.attr("data-object") == "event") {
                removeEvent(objectButton);
            }
            if (objectButton.attr("data-object") == "pastScene") {
                removePastScene(objectButton);
            }
            if (objectButton.attr("data-object") == "place") {
                removePlace(objectButton);
            }
            if (objectButton.attr("data-object") == "resource") {
                removeResource(objectButton);
            }
            if (objectButton.attr("data-object") == "relation") {
                removeRelation(objectButton);
            }
            return false;
        }
    });
}

// ajoute une entité dans la vue intrigue
function appendEntity(entity, value, label, flag, id) {
    var template = Handlebars.templates['templates/redactIntrigue/addEntityLiElement'];
    var context = {
        entityName: value,
        entityLabel: label,
        flag: flag,
        id: id
    };
    var html = template(context);
    $(html).insertBefore('.' + entity + 'Selector li:last-child');
    if (flag != "") {
        createNotification("info", "ajout réussi.", "Votre entité a bien été ajoutée, vous pourrez la compléter ultérieurement.");
    }
}

//evite de descendre quand on clique sur un bouton du menu
function bgenScroll(e) {
    if (window.pageYOffset != null) {
        st = window.pageYOffset + '';
    }
    if (document.body.scrollWidth != null) {
        if (document.body.scrollTop) {
            st = document.body.scrollTop;
        }
        st = document.documentElement.scrollTop;
    }
    setTimeout('window.scroll(0,st)', 50);
}

//desactive le weight des tags
function toggle(checkboxID, toggleID) {
    var checkbox = document.getElementById(checkboxID);
    var toggle = document.getElementById(toggleID);
    updateToggle = toggle.disabled = !checkbox.checked;
}

//initialise les boutons de suppression d'entité
function initDeleteButton() {
    $('.leftMenuList a').click(function() {
        $('.leftMenuList button').css("right", "-40px");
        var button = $(this).next();
        button.css("right", "0px");
    });
}

//Function to insert text in div editable for the description rich editor
function pasteHtmlAtCaret(html) {
    var sel, range;
    if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();

            // Range.createContextualFragment() would be useful here but is
            // only relatively recently standardized and is not supported in
            // some browsers (IE9, for one)
            var el = document.createElement("div");
            el.innerHTML = html;
            var frag = document.createDocumentFragment(), node, lastNode;
            while ((node = el.firstChild)) {
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);

            // Preserve the selection
            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    } else if (document.selection && document.selection.type != "Control") {
        // IE < 9
        document.selection.createRange().pasteHTML(html);
    }
}

//Dernière position du curseur dans l'éditeur
var carretPos = null;

//On sauvegarde la position du curseur lorsque l'éditeur perd le focus
function saveCarretPos(editorName) {
    var caretOffset = 0;
    var element = document.getElementById(editorName);
    var doc = element.ownerDocument || element.document;
    var win = doc.defaultView || doc.parentWindow;
    var sel;
    if (typeof win.getSelection != "undefined") {
        var range = win.getSelection().getRangeAt(0);
        var preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
    } else if ((sel = doc.selection) && sel.type != "Control") {
        var textRange = sel.createRange();
        var preCaretTextRange = doc.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        caretOffset = preCaretTextRange.text.length;
    }
    carretPos = window.getSelection().getRangeAt(0); //caretOffset;
    focusedNode = document.activeElement;
    document.getElementById("printHere").innerText = carretPos;

}

// Avant d'insert l'objet on remet le curseur à l'endroit sauvegardé
function setCarretPos() {
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(carretPos);
}

// on remplace les balise de la description par des span html
function initializeTextEditor() {
    $('.richTextEditor').each(function() {
        var description = $(this).html();
        while (description.length != 0 && (description[0] == '\n' ||
            description[0] == ' ' || description[0] == '\r')) {
            description = description.substring(1, description.length)
        }
        while (description.length != 0 && (description[description.length - 1] == '\n' ||
            description[description.length - 1] == ' ' || description[description.length - 1] == '\r')) {
            description = description.substring(0, description.length - 1)
        }
        description = description.replace(/\n/g, '<br>');
        description = description.replace(/&lt;l:/g, '<span class="label label-warning" contenteditable="false" data-toggle="popover" data-original-title="Choix balise" title="">');
        description = description.replace(/&lt;o:/g, '<span class="label label-important" contenteditable="false" data-toggle="popover" data-original-title="Choix balise" title="">');
        description = description.replace(/&lt;i:/g, '<span class="label label-success" contenteditable="false" data-toggle="popover" data-original-title="Choix balise" title="">');
        description = description.replace(/&lt;u:/g, '<span class="label label-default" contenteditable="false" data-toggle="popover" data-original-title="Choix balise" title="">');
        description = description.replace(/&gt;/g, '</span>');
        description = "<div>" + description + "</div>";
        var html = $(description);
        $("span br", html).remove();
        description = html.html();
        $(this).html(description);
        $('.label[contenteditable="false"]').attr("data-content", spanPopover);
    });
    var spanPopover = '<div class="specialTag"><button class="btn btn-small btn-primary">Article</button>' +
        '<button class="btn btn-small btn-primary">Nominatif</button></div>' +
        '<div class="specialTag"><button class="btn btn-small btn-primary">Particule</button>' +
        '<button class="btn btn-small btn-primary">Possessif</button></div>' +
        '<div class="specialTag"><button class="btn btn-danger btn-small">Aucune</button></div>';
    $('.label[contenteditable="false"]:not(.label-success)').popover({
        html: 'true',
        placement: 'top',
        content: spanPopover,
        container: "body"
    });
}

// on remplace les span html dans une description par des balises
function transformDescription(description) {
    description = "<div>" + description + "</div>";
    var html = $(description);
    $("span:not(.label)", html).contents().unwrap();
    description = html.html();
    description = description.replace(/<div>/g, '\n');
    description = description.replace(/<\/div>/g, '\n');
    description = description.replace(/<br>/g, '\n');
    description = description.replace(/<span class="label label-warning" contenteditable="false" data-toggle="popover" data-original-title="Choix balise" title="">/g, '<l:');
    description = description.replace(/<span class="label label-important" contenteditable="false" data-toggle="popover" data-original-title="Choix balise" title="">/g, '<o:');
    description = description.replace(/<span class="label label-success" contenteditable="false" data-toggle="popover" data-original-title="Choix balise" title="">/g, '<i:');
    description = description.replace(/<span class="label label-default" contenteditable="false" data-toggle="popover" data-original-title="Choix balise" title="">/g, '<u:');
    description = description.replace(/<\/span>/g, '>');
    description = description.replace(/&nbsp;/g, ' ');
    description = description.replace(/&lt;l:/g, '<l:');
    description = description.replace(/&lt;o:/g, '<o:');
    description = description.replace(/&lt;i:/g, '<i:');
    description = description.replace(/&lt;u:/g, '<u:');
    description = description.replace(/&gt;/g, '>');
    return description;
}

//update all these forms
function updateAllDescription(formlist) {
    formlist.each(function() {
        $('input[name="Update"]', $(this)).trigger("click");
    });
}