/* Axel's conkerorrc -*- js2 -*-
 *
 * git repository at http://git.noone.org/?p=conkerorrc.git
 */

//require("new-tabs.js");
//require("tab-bar.js");
require("clicks-in-new-buffer.js");
require("page-modes/google-search-results.js");
require("page-modes/wikipedia.js");
require("index-webjump.js");
//require("extensions/adblockplus.js");
//require("extensions/noscript.js");
require("session.js");
require("block-content-focus-change.js");
require("favicon");

/*
load_paths.unshift("chrome://conkeror-contrib/content/");
require("mode-line-buttons.js");
mode_line_add_buttons(standard_mode_line_buttons, true);
*/

// Some settings
session_auto_save_auto_load = "prompt";
url_remoting_fn = load_url_in_new_buffer;
view_source_use_external_editor = false;
xkcd_add_title = true;
read_buffer_show_icons = true;
hints_display_url_panel = true;

// Delayed session load
/*

From http://retroj.net/git/conkerorrc/content-delay.js

This script is a hack that provides delayed loading for content buffers.
The initial url of a buffer will not be loaded until that buffer is
switched to.  Precaution is taken that the buffer's display_uri_string
returns the delayed url, not about:blank, so things like tabs and sessions
will still work properly.

*/

function content_delay (spec) {
    this.delayed_load = spec;
}

function content_delay_init (b) {
    if (b != b.window.buffers.current &&
        b instanceof content_buffer)
    {
        b.load = content_delay;
        b.__defineGetter__("display_uri_string",
            function () {
                if (this.delayed_load) {
                    if (this.delayed_load instanceof load_spec)
                        return load_spec_uri_string(this.delayed_load);
                    return this.delayed_load;
                }
                if (this._display_uri)
                    return this._display_uri;
                if (this.current_uri)
                    return this.current_uri.spec;
                return "";
            });
    }
}

function content_delay_do_initial_load (b) {
    if (b.hasOwnProperty("load")) {
        delete b.load;
        if (b.hasOwnProperty("delayed_load")) {
            b.load(b.delayed_load);
            delete b.delayed_load;
        }
    }
}

add_hook("create_buffer_early_hook", content_delay_init);
add_hook("select_buffer_hook", content_delay_do_initial_load);

// favicons hook
add_hook("mode_line_hook", mode_line_adder(buffer_icon_widget), true);
add_hook("mode_line_hook", mode_line_adder(loading_count_widget), true);
add_hook("mode_line_hook", mode_line_adder(buffer_count_widget), true);

//browser_prevent_automatic_form_focus_mode(true);
google_search_bind_number_shortcuts();

// Webjump oneliners
define_webjump("codesearch", "http://www.google.com/codesearch?q=%s");
define_webjump("cpan", "http://search.cpan.org/search?query=%s&mode=all");
define_webjump("leo", "http://dict.leo.org/?lp=ende&lang=de&searchLoc=0&cmpType=relaxed&relink=on&sectHdr=off&spellToler=std&search=%s");
define_webjump("identica", "http://identi.ca/%s");
define_webjump("imdb", "http://imdb.com/find?q=%s");
define_webjump("kol", "http://kol.coldfront.net/thekolwiki/index.php/%s");
define_webjump("ohloh", "https://www.ohloh.net/p?query=%s");
define_webjump("ixquick", "http://ixquick.com/do/metasearch.pl?query=%s");
define_webjump("trans", "http://translate.google.com/translate_t#auto|en|%s");
define_webjump("twitter", "http://twitter.com/%s");
define_webjump("urban", "http://www.urbandictionary.com/define.php?term=%s");
define_webjump("wolframalpha", "http://www.wolframalpha.com/input/?i=%s");
define_webjump("youtube", "http://www.youtube.com/results?search_query=%s&search=Search");

// CVE
define_webjump("cve", "https://cve.mitre.org/cgi-bin/cvename.cgi?name=%s");

// New Debian Webjumps
define_webjump("debscreen", "http://screenshots.debian.net/package/%s");
define_webjump("debsnap", "http://snapshot.debian.org/package/%s/");
define_webjump("debsec", "http://security-tracker.debian.org/tracker/?query=%s");

// JS Webjumps
define_webjump("longurl", "javascript:void(function(){if(typeof%20jQuery%20==%20'undefined'){var%20s=document.createElement('script');s.src='http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.min.js';document.getElementsByTagName('head')[0].appendChild(s);}var%20l=document.createElement('script');l.src='http://www.longurlplease.com/js/longurlplease.js';document.getElementsByTagName('head')[0].appendChild(l);function%20runIfReady(){try{if($.longurlplease){%20clearInterval(interval);%20$.longurlplease();}}catch(e){}};%20var%20interval%20=%20window.setInterval(runIfReady,100);}())");

// Multiple Webjumps
define_gitweb_summary_webjump("gitweb-ko", "http://git.kernel.org");
define_gitweb_summary_webjump("gitweb-cz", "http://repo.or.cz/w");

wikipedia_enable_didyoumean = true;
define_wikipedia_webjumps("en", "de");

// Personalized Webjumps
define_delicious_webjumps("xtaran");
define_lastfm_webjumps("XTaran");

// Longer Webjumps
define_webjump("down?",
  function (url) {
    if (url) {
      return "http://downforeveryoneorjustme.com/" + url;
    } else {
      return "javascript:window.location.href='http://downforeveryoneorjustme.com/'+window.location.href;";
    }
  },
  $argument = "optional",
  $completer = history_completer($use_history = false, $use_bookmarks = true));

define_webjump("wayback",
  function (url) {
    if (url) {
      return "http://web.archive.org/web/*/" + url;
    } else {
      return "javascript:window.location.href='http://web.archive.org/web/*/'+window.location.href;";
    }
  },
  $argument = "optional",
  $completer = history_completer($use_history = false, $use_bookmarks = true));

// ETH Webjumps
define_webjump("rt", "https://rt.phys.ethz.ch/rt/Search/Simple.html?q=%s",
                     $alternative = "https://rt.phys.ethz.ch/rt/");
define_webjump("rtwiki", "https://rt.phys.ethz.ch/wiki/doku.php?do=search&id=%s",
                         $alternative = "https://rt.phys.ethz.ch/wiki/doku.php");
define_webjump("readme", "https://wiki.phys.ethz.ch/readme/doku.php?do=search&id=%s",
                         $alternative = "https://wiki.phys.ethz.ch/readme/doku.php");

// Additional key bindings

//define_key(content_buffer_normal_keymap, "C-t", "find-url-new-buffer");
//define_key(content_buffer_normal_keymap, "C-t", "make-window");
//define_key(content_buffer_normal_keymap, "C-w", "kill-current-buffer");
define_key(content_buffer_normal_keymap, "M-left", "back");
define_key(content_buffer_normal_keymap, "M-right", "forward");

///////////////////////////////////////////////////////

/*
 * TODO: C-x C-b
 */

/*
function list_buffers (buffer, target) {
    var list = [];
    list.sort(function (a,b) {
                  if (a.name < b.name)
                      return -1;
                  if (a.name > b.name)
                      return 1;
                  return 0
              });
    create_buffer(buffer.window, buffer_creator(list_buffers_buffer,
                                                $opener = buffer,
                                                $command_list = list),
                  target);
}

interactive("list-buffers", "List all buffers",   function(I) {
          });

*/


// See also http://kb.mozillazine.org/Network.proxy.type
require("minibuffer-completion.js");
function get_proxy_description(x) {
  switch (x) {
    case 'direct':             return 'Direct connection, no proxy';
    case 'manual':             return 'Manually configured proxy';
    case 'auto-configuration': return 'Proxy auto-configuration (PAC)';
    case 'auto-detection':     return 'Auto-detect proxy settings';
    case 'system-settings':    return 'Use system proxy';
  }
  return '';
}

function get_proxy_value(x) {
  switch (x) {
    case 'direct':             return 0;
    case 'manual':             return 1;
    case 'auto-configuration': return 2;
    case 'auto-detection':     return 4;
    case 'system-settings':    return 5;
  }
  return '';
}

function proxy_type_completer (input, cursor_position, conservative) {
  var completions = ['direct',
		     'manual',
		     'auto-configuration',
		     'auto-detection',
		     'system-settings'];
  yield co_return(
    prefix_completer($completions = completions,
		     $get_description = get_proxy_description,
		     $get_value = get_proxy_value)
    (input, cursor_position, conservative));
}

interactive("set-proxy-type", "Change the proxy type or turn proxies off",
  function(I) {
    var proxytype = yield I.minibuffer.read(
      $prompt = "Proxy type to use?",
      $history = "proxytype",
      $completer = proxy_type_completer,
      $match_required = true);
    user_pref("network.proxy.type", proxytype);
  }
);

// From http://jjfoerch.com/git/conkerorrc/commands.js
interactive("delete", null,
    function (I) {
        var elem = yield read_browser_object(I);
        elem.parentNode.removeChild(elem);
    },
    $browser_object = browser_object_dom_node);

define_key(content_buffer_normal_keymap, "d", "delete");

// Cookie Culler Stuff
const cookie_culler_chrome = "chrome://cookieculler/content/CookieCuller.xul";

interactive("cookie-culler-dialog", "Show the CookieCuller settings in a dialog box.",
    function (I) {
        var frame = I.buffer.top_frame;
        frame.openDialog(cookie_culler_chrome,
                         "CookieCuller",
                         "centerscreen,chrome,dialog,modal,resizable");
    });

interactive("cookie-culler", "Open the CookieCuller settings in a new buffer.",
    "find-url-new-buffer",
    $browser_object = cookie_culler_chrome);
