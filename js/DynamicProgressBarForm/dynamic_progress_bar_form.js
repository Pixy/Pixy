/*==============================
=            README            =
==============================*/
/*
*
* @Author : Pierre-Alexis GODET
*
* Dynamic progressbar for single or multi pages form
* 
* HTML FOR THE PROGRESSBAR :
<div id="chargement_wrapper">
    <div id="chargement">
        <div style="width: 100%;" id="chargement_under">&nbsp;</div>
        <div style="" id="chargement_top">&nbsp;</div>
    </div>
    <div class="chargement_bulle_wrapper">
        <div class="chargement_bulle" style="">
            <p>0</p>
        </div>
    </div>
</div>
*
* Initialize the page(s) of your form in the var "helper.pages"
*
* ! IMPORTANT !
* Adapt the "CurrentPageName" function with the URL you use
*
* REQUIRES JQUERY
*
*/
/*-----  End of README  ------*/



(function($) {
    $(document).ready(function($) {
        PagesHelper.init();
    });


    /*=============================================
    =            Pages Helper Definition          =
    =============================================*/
    var PagesHelper = window.PagesHelper = (function(undefined) {
        var helper = {};

        /*=================================================
        =            Wizard statring variables            =
        =================================================*/
        helper.pages = {
            'Coordonnees': {
                'min_percent': 0,
                'max_percent': 20,
                'current_margin': 0,
                'current_percent': 0
            },
            'Affiliation': {
                'min_percent': 20,
                'max_percent': 40,
                'current_margin': 0,
                'current_percent': 20
            },
            'Complements': {
                'min_percent': 40,
                'max_percent': 70,
                'current_margin': 0,
                'current_percent': 40
            }, 
            'Confirmation': {
                'min_percent': 100,
                'max_percent': 100,
                'current_margin': 0,
                'current_percent': 100
            }
        };
        /*-----  End of Wizard statring variables  ------*/

        helper.local_fields = {}; // Used for validations

        /**
         * Get the current page name
         * Return string
         **/
        helper.CurrentPageName = function() {
            return document.location.pathname.split('/')[(document.location.pathname.split('/')).length-1];
        };

        /**
         * Get the Current page object
         * return helper.page object
         **/
        helper.CurrentPage = function() {
            return helper.pages[helper.CurrentPageName()];
        };

        /**
         * Init the progress bar 
         **/
        helper.init = function() {
            helper.fields = $('form input, form select');
            $('#chargement #chargement_top').attr('style', '').css('width', 15); // RESET CSS
            $('.chargement_bulle_wrapper .chargement_bulle').css('margin-left', 0).find('p').html(0); // RESET css
            helper.watchFields();
            helper.firstInit();
        };


        /**
         * First initialization of the page
         **/
        helper.firstInit = function() {
            /*====================================
            =            FIRST MARGIN            =
            ====================================*/
            // Get the intervalle in px of each field to increase or decrease, with the width in px of the progressbar - round up the number
            helper.intervalle = Math.ceil((($('#chargement').width() * (helper.pages[helper.CurrentPageName()]['max_percent']  - helper.pages[helper.CurrentPageName()]['min_percent'])) / 100) / helper.nb_fields_to_watch);

            // Get the intervalle in % for displaying number in the bullet
            helper.intervalle_percent = Math.ceil((helper.pages[helper.CurrentPageName()]['max_percent'] - helper.pages[helper.CurrentPageName()]['min_percent']) / helper.nb_fields_to_watch);

            // Get the current percent of the current page for initialization
            helper.current_percent = helper.pages[helper.CurrentPageName()]['min_percent'];

            // Set the starting margin for the current page
            helper.pages[helper.CurrentPageName()]['current_margin'] = ($('#chargement').width() * (PagesHelper.pages[PagesHelper.CurrentPageName()]['min_percent'])) / 100;

            // Animate the filling of the progressbar 
            $('.chargement_bulle_wrapper .chargement_bulle').animate({
                'margin-left': helper.pages[helper.CurrentPageName()]['current_margin'] - 15 // - 15 for the width of the bullet, to adapt or delete with the design
            }, 200, function() {
                // The % must not be > to the current page max percent - Display the number %
                if(helper.current_percent > helper.pages[helper.CurrentPageName()]['max_percent']) {
                    $('.chargement_bulle_wrapper .chargement_bulle p').html(helper.pages[helper.CurrentPageName()]['max_percent']);  
                } else {
                    $('.chargement_bulle_wrapper .chargement_bulle p').html(Math.ceil(helper.current_percent));    
                }
            });

            // Move the bullet 
            $('#chargement #chargement_top').css('width', helper.pages[helper.CurrentPageName()]['current_margin']);
            /*-----  End of FIRST MARGIN  ------*/


            /*============================================================================
            =            First check of each fields and increase if not empty            =
            ============================================================================*/
            $.each(helper.local_fields, function(key, val) {
                 if (val['type'] == 'select') {
                    if($('select[name='+ key +']').val() != '') {
                        helper.increment();
                    }
                 } else {
                    if($('input[name='+ key +']').val() != '') {
                        if(val['type'] == "radio") {
                            if($('input[name='+ key +']:checked').val() != undefined) {
                                helper.increment();    
                            }
                        } else {
                            helper.increment();
                        }
                    }
                 }
            });
            /*-----  End of First check of each fields and increase if not empty  ------*/
        }


        /**
         * Loop for initialize binding of each field 
         * Then set the nb_fields_to_watch (used for intervalle)
         **/
        helper.watchFields = function() {
            helper.nb_fields_to_watch = 0;

            /*========================================
            =            Watch each field            =
            ========================================*/
            helper.fields.each(function(i, e) {
                if ($(e).attr('type') != "hidden" && $(e).attr('type') != "submit" && $(e).attr('type') != "button" && $(e)[0].required) {
                    if($(e).attr('type') == undefined) {
                        helper.watchField(e, 'select');
                    } else {
                        helper.watchField(e, $(e).attr('type'));
                    }
                };
            });
            /*-----  End of Watch each field  ------*/

            /*===============================================================
            =            Get the total number of inputs required            =
            ===============================================================*/
            // DO AFTER FIRST LOOP BECAUSE OF THE INPUT TYPE RADIO FIELDS
            var i = 0;
            $.each(helper.local_fields, function(index, val) {
                 i++;
            });
            helper.nb_fields_to_watch = i;
            /*-----  End of Get the total number of inputs required  ------*/
        };


        /**
         * Conditions for INPUT type RADIO/EMAIL/TEXT/NUMER)
         **/
        helper.watchInput = function(field) {
            var new_value = $(field).val();
            if(new_value == '') {
                if(helper.local_fields[$(field)[0].name]['previous_value'] != '') {
                    helper.decrement();
                    helper.local_fields[$(field)[0].name]['previous_value'] = new_value;
                }
            } else {
                if(helper.local_fields[$(field)[0].name]['previous_value'] == '') {
                    helper.increment();
                    helper.local_fields[$(field)[0].name]['previous_value'] = new_value;
                }
            }
        }

        /**
         * Conditions for SELECT
         **/
        helper.watchSelect = function(field) {
            var new_value = $(field).val();
            if(new_value == '') {
                if(helper.local_fields[$($(field)[0]).attr('name')]['previous_value'] != '') {
                    helper.decrement();
                    helper.local_fields[$($(field)[0]).attr('name')]['previous_value'] = new_value;
                }
            } else {
                if(helper.local_fields[$($(field)[0]).attr('name')]['previous_value'] == '') {
                    helper.increment();
                    helper.local_fields[$($(field)[0]).attr('name')]['previous_value'] = new_value;
                }
            }
        }
 

        /**
         * Init add event for each field
         **/
        helper.watchField = function(field, type) {
            switch(type) {
                case 'text':
                case 'numer':
                case 'email':
                    /*==================================
                    =            Init field            =
                    ==================================*/
                    helper.local_fields[$(field)[0].name] = {'previous_value': '', 'type': ''};
                    helper.local_fields[$(field)[0].name]['previous_value'] = $(field).val();
                    helper.local_fields[$(field)[0].name]['type'] = type;
                    

                    $(field).bind('keyup, change', function(event) {
                        helper.watchInput(field);
                    });
                    break;
                    /*-----  End of Init field  ------*/

                case 'radio':
                    /*==================================
                    =            Init field            =
                    ==================================*/
                    helper.local_fields[$(field)[0].name] = {'previous_value': '', 'type': ''};
                    helper.local_fields[$(field)[0].name]['type'] = type;
                    
                    $(field).bind('keyup, change', function(event) {
                        helper.watchInput(field);
                    });
                    break;
                    /*-----  End of Init field  ------*/
                case 'select':
                    helper.local_fields[$($(field)[0]).attr('name')] = {'previous_value': '', 'type': ''};
                    helper.local_fields[$($(field)[0]).attr('name')]['previous_value'] = $(field).val();
                    helper.local_fields[$($(field)[0]).attr('name')]['type'] = 'select';

                    $(field).change(function(event) {
                        helper.watchSelect(field);
                    });
                    break;

                default:
                    break;
            }
        };

        /**
         * Increment the progressbar
         **/
        helper.increment = function() {
            helper.pages[helper.CurrentPageName()]['current_margin'] = helper.pages[helper.CurrentPageName()]['current_margin'] + helper.intervalle;
            helper.current_percent = Math.ceil(helper.current_percent + helper.intervalle_percent);

            $('.chargement_bulle_wrapper .chargement_bulle').animate({
                'margin-left': helper.pages[helper.CurrentPageName()]['current_margin'] - 15
            }, 200, function() {
                if(helper.current_percent > helper.pages[helper.CurrentPageName()]['max_percent']) {
                    helper.current_percent = helper.pages[helper.CurrentPageName()]['max_percent'];
                }
                $('.chargement_bulle_wrapper .chargement_bulle p').html(helper.current_percent);    
            });

            $('#chargement #chargement_top').css('width', helper.pages[helper.CurrentPageName()]['current_margin']);
        }

        /**
         * Decrement the progressbar
         **/
        helper.decrement = function() {
            // Get the 
            helper.pages[helper.CurrentPageName()]['current_margin'] = helper.pages[helper.CurrentPageName()]['current_margin'] - helper.intervalle;
            helper.current_percent = Math.floor(helper.current_percent - helper.intervalle_percent);

            var progress_bar_width = Math.floor(helper.pages[helper.CurrentPageName()]['current_margin']) <= helper.pages[helper.CurrentPageName()]['min_percent'] ? 15 : helper.pages[helper.CurrentPageName()]['current_margin'];
            var margin_left = progress_bar_width <= 15 ? helper.pages[helper.CurrentPageName()]['min_percent'] : helper.pages[helper.CurrentPageName()]['current_margin'] - 15;

            $('.chargement_bulle_wrapper .chargement_bulle').animate({
                'margin-left': margin_left
            }, 200, function() {
                if(helper.current_percent < helper.pages[helper.CurrentPageName()]['min_percent']) {
                    helper.current_percent = helper.pages[helper.CurrentPageName()]['min_percent'];
                }
                $('.chargement_bulle_wrapper .chargement_bulle p').html(helper.current_percent); 
            });

            $('#chargement #chargement_top').css('width', progress_bar_width);
        }


        return helper;
    })();
})(jQuery);