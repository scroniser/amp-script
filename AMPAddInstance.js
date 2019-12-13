// ==UserScript==
// @name         AMP - monkeying the tamper
// @namespace    http://tampermonkey.net/
// @version      5.1.9.2
// @description  Adds some much needed functionality to AMP.
// @author       Santina (originally Alex and Kevin)
// @match        *.levelaccess.net/public/reporting/*
// @match        *.levelaccess.net/public/audit/*
// @match        *.levelaccess.io/public/reporting/*
// @match        *.levelaccess.io/public/audit/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/scroniser/amp-script/master/AMPAddInstance.js
// @downloadURL  https://raw.githubusercontent.com/scroniser/amp-script/master/AMPAddInstance.js
// @supportURL   https://level-access.slack.com/messages/CK79W4PPU/
// @icon         https://nva11y.com/images/tm-logo2.png
// ==/UserScript==

// TODO List
/*
   Drag and Drop Images to ADD Instance
   Add Instance Modal: Make the alert dynamic. Should appear when code is pasted in.
   Write generic listener event to look for dynamic lists, such as modules
   Make the "Mark Complete" checkbox actually mark it complete

   IN PROGRESS: Figure out a way to add a module to a existing pattern FROM the view module page.
       DONE: AJAX call
       DONE: Now have it as a variable.
       TODO: Need to manipulate it into a new table.
       TODO: Set up as a tab rather than always showing. (SHOW on clickID, but then need to HIDE on all other tab clicks)
*/

// GLOBAL VARIABLE: Start by setting jquery as the $ variable as a global to this page (Not sure why I have to do this).
var $ = window.jQuery;

/* Data Functions (All data moved into functions for a future project of putting this information into an external location) */

function dataStatus() {
   var status = [
     {
       id: "code-pattern",
       div: "Pattern",
       text: "Pattern"
     },
     {
       id: "extras-Occurrences",
       text: "Occurrences",
       var1: "Occurrences"
     },

     {
       id: "status-advisory",
       div: "Status",
       text: "Advisory",
       date: "no"
     },
     {
       id: "status-fixed",
       text: "Fixed",
       var1: "fixed"
     },
     {
       id: "status-notfixed",
       text: "Not Fixed",
       var1: "failed_retesting"
     },
     {
       id: "status-new",
       text: "New",
       var1: "new"
     },
     {
       id: "status-not",
       text: "Not Retested",
       var1: "needs_retesting"
     },
     {
       id: "status-wip",
       div: "Work In Progress",
       text: "WIP",
       date: "no"
     },
     {
       id: "status-wipName",
       text: "WIP - Name",
       date: "name"
     },
     {
       id: "code-modIns",
       div: "Special",
       text: "Module/Instance"
     },
     {
       id: "special-typeDev",
       text: "Type: DEV",
       var1: "Type: DEV",
       loc: "1"
     },
     {
       id: "special-typeDes",
       text: "Type: DESIGN",
       var1: "Type: DESIGN",
       loc: "1"
     },
     {
       id: "status-wcag-a",
       text: "WCAG: A"
     },
     {
       id: "status-wcag-aa",
       text: "WCAG: AA"
     },
     {
       id: "status-wcag-aaa",
       text: "WCAG: AAA"
     }
   ];
   return status;
}

function dataReading() {
   var reading = [{
      id: "reading-accordians",
      text: "Accordions",
      div: "Reading",
      var1: "\n\n[Recommended Reading]\nMore information about creating accessible accordions can be found on the W3C website:\n\nhttps://www.w3.org/TR/wai-aria-practices/examples/accordion/accordion.html"
   },
   {
      id: "reading-ariastate",
      text: "Aria States",
      var1: "\n\n[Recommended Reading]\nMore information about the correct use of ARIA states, roles and properties can be found on the Level Access website:\n\nhttps://www.levelaccess.com/how-not-to-misuse-aria-states-properties-and-roles/"
   },
   {
      id: "reading-carousels",
      text: "Carousels",
      var1: "\n\n[Recommended Reading]\nMore information about creating accessible carousels can be found on the W3C website:\n\nhttps://www.w3.org/WAI/tutorials/carousels/"
   },
   {
      id: "reading-complex",
      text: "Complex Images",
      var1: "\n\n[Recommended Reading]\nMore information about describing complex images can be found on the W3C website:\n\nhttps://www.w3.org/WAI/tutorials/images/complex/"
   },
   {
      id: 'reading-grid',
      text: 'Data grids',
      var1: "\n\n[Recommended Reading]\nMore information about creating accessible grids for presenting tabular information can be found on the W3C website:\n\nhttps://www.w3.org/TR/wai-aria-practices-1.1/#grid"
   },
   {
      id: "reading-datepicker",
      text: "Date Picker",
      var1: "\n\n[Recommended Reading]\nMore information about creating an accessible date picker can be found on the WhatSock Technical Style Guide:\n\nhttp://whatsock.com/tsg/#tgl-2-3"
   },
                  {
                      id: "reading-dropdown",
                      text: "Drop-down menu",
                      var1: "\n\n[Recommended Reading]\nMore information about creating accessible drop-down menus can be found on the W3C site.\n\nhttps://www.w3.org/WAI/tutorials/menus/flyout/"
                  },
   {
      id: "reading-errors",
      text: "Error Messages",
      var1: "\n\n[Recommended Reading]\nMore information about creating accessible error messages can be found on the Level Access and W3C's Websites:\n\nhttps://www.levelaccess.com/how-to-provide-accessible-error-identification\n\nhttps://www.w3.org/WAI/tutorials/forms/notifications/"
   },
   {
      id: "reading-headings",
      text: "Headings",
      var1: "\n\n[Recommended Reading]\nMore information about creating heading structures can be found on the W3C's Website:\n\nhttps://www.w3.org/WAI/tutorials/page-structure/headings/"
   },
   {
      id: 'reading-modals',
      text: 'Modals',
      var1: "\n\n[Recommended Reading]\nMore information about creating accessible dialog/modals can be found on the W3C website:\n\nhttps://www.w3.org/TR/wai-aria-practices-1.1/#dialog_modal"
   },
   {
      id: 'reading-radio',
      text: 'Radio Group',
      var1: "\n\n[Recommended Reading]\nMore information about creating accessible groups of radio buttons can be found on the W3C website:\n\nhttps://www.w3.org/TR/wai-aria-practices-1.1/#radiobutton"
   },
   {
      id: "reading-tabs",
      text: "Tabs",
      var1: "\n\n[Recommended Reading]\nMore information about creating accessible tabs can be found on the W3C website:\n\nhttps://www.w3.org/TR/wai-aria-practices-1.1/#tabpanel"
   },
   {
      id: "reading-codeoffscreen",
      text: "Off Screen Text",
      div: "CSS",
      var1: "\n\n[CSS]\n<style>\n.sr-only {\n  position: absolute !important;\n  height: 1px; \n  width: 1px; \n  overflow: hidden;\n  padding: 0 !important;\n  border: 0! important;\n  white-space: nowrap !important;\n  clip: rect(1px 1px 1px 1px) !important; /* IE6, IE7 */\n  clip: rect(1px, 1px, 1px, 1px) !important;\n  clip-path: inset(50%) !important;\n}\n</style>"
   },
   {
      id: "reading-codevisualfocus",
      text: "Visual Focus",
      var1: "\n\n[CSS]\n<style>\na:hover, a:active, a:focus, button:hover, button:active, button:focus {\n    outline: 1px dotted #ff0000; \n}\n</style>"
   }
   ];
   return reading;
}

function dataResponse() {
   var response = [
      // ARIA
      {
         id: "response-aria",
         text: "General",
         div: "ARIA",
         var1: "[Issue]\n\n\n[User Impact]\nWhen ARIA attributes (state, roles, and properties) are inappropriately used or not used correctly, assistive technology may not correctly function as expected. Role and properties are covenants between assistive technology and the application and must be accurate for the intended purpose. Valid markup should always be used.\n\n[Code Reference]\n",
         keepOrig1: "true",
         var2: "[Recommendation]\nDevelopers must use valid markup and follow the rules of the ARIA specification as well as correctly setting ARIA properties, including roles based on the intended purpose.\n\n[Recommended Reading]\nMore information about using ARIA roles can be found on the Level Access Website:\n\nhttps://www.levelaccess.com/how-not-to-misuse-aria-states-properties-and-roles/\n\n[Compliant Code Example]\n",
         keepOrig2: "true"
      },

      {
         id: "response-ariaimplicit",
         text: "Implicit Role",
         var1: "[Issue]\nThere are elements on the page that have assigned roles but already have implicit ARIA roles. These are redundant and should be removed. Structural implicit roles include (but are not limited to[ELEMENT/role]):\n- MAIN = main\n- HEADER = banner \n- FOOTER = contentinfo\n- ASIDE = complementary\n- FORM = form\n- NAV = navigation\n\nInline implicit roles include A = link, BUTTON = button, and many others.\n\n[Impact]\nWhen ARIA attributes (state, roles, and properties) are inappropriately used, assistive technology may not correctly function as expected. Role and properties are covenants between assistive technology and the application and must be accurate for the intended purpose.\n\n[Code Reference]\n",
         keepOrig1: "true",
         var2: "[Recommendation]\nRemove the redundant role from all of the elements.\n\nMore information can be found about implicit ARIA roles here:\nhttps://a11yproject.com/posts/aria-landmark-roles/\n\n[Compliant Code Example]\n",
         keepOrig2: "true"
      },
      {
         id: "response-ariaregion",
         text: "Region",
         var1: "[Issue]\n\n\n[User Impact]\nWhen ARIA regions, landmarks or HTML5 section elements are provided, users must be able to distinguish them from other regions, landmarks or sections in the page, particularly when two or more instances of the same type are used. When such an element does not provide a descriptive label to clearly identify itself, users of screen readers may have trouble locating the correct section or understanding its purpose.\n\n[Code Reference]\n",
         keepOrig1: "true",
         var2: "[Recommendation]\nCommon methods of providing accessible labels are the aria-labelledby attribute (best used when a visual label already exists in the page) and the aria-label attribute (when no visual label exists).\n\n[Compliant Code Example]\n",
         keepOrig2: "true"
      },

      // COLOR
      {
         id: "response-color",
         text: "Color Contrast",
         div: "Color",
         var1: "[Issue]\n\n\n[User Impact]\nEnsure there is sufficient contrast between foreground and background colors. This requirement applies to text over solid and image backgrounds as well as images that contain text. Proper foreground and background contrast is necessary for users with low vision and some users with color blindness to accurately read content.\n\n[Code Reference]\n",
         keepOrig1: "true",
         keepOrig2: "issue",
         var2: "[Recommendation]\nDevelopers must ensure that the color contrast for all text (and images of text) meets the WCAG 2.0 Level AA requirements unless specifically excluded.\n\nDesigners or developers should modify the foreground color, background color, and/or font size so that sufficient contrast is attained.\n\nStandard text less than 18 point (or less than 14 point if bold) must have a luminosity contrast ratio of 4.5:1 or more.\n\nText 18 point or larger (14 point or larger if bold) must have a luminosity contrast ratio of 3:1 or more.\n\nUse the Level Access contrast checking tool or plugin (https://accessibility.dev/) to determine if the contrast is sufficient.\n\n"
      },

      // CUSTOM CONTROLS
      {
         id: "response-customControl",
         text: "Role/State",
         div: "Custom Controls",
         var1: "[Issue]\n\n\n[User Impact]\nAt a basic level, all custom controls within a web application should provide identifying information about the component. This includes a name, type (role) and may contain state, value, and description information. When custom elements do not expose identifying information, users of assistive technology may not be able to identify and interact with the element. For example, without knowing the role or state of an element, the user of a screen reader may not know what actions can be performed on an element even if the element exposes a textual name. Without a proper role, assistive technology interactions that rely on roles being identified may not become available to the user.\n\n[Code Reference]\n",
         keepOrig1: "true",
         var2: "[Recommendation]\nEnsure that proper identifying information is provided for custom components. Generally, Accessible Rich Internet Application (ARIA) specification roles, properties, and states should be used to indicate the control's name and role and may be needed for state, value, description, or other properties. Appropriate states need to be provided when applicable -- e.g. aria-expanded on buttons to indicate the expanded or collapsed state of an accordion. \n\n[Compliant Code Example]\n",
         keepOrig2: "true"
      },

      // FORMS
      {
         id: "response-fieldset",
         text: "Fieldset",
         div: "Forms",
         var1: '[Issue]\n\n\n[User Impact]\nForms should utilize the fieldset and legend elements to group related form controls. For example, on an order form, authors should separate categories such as "Billing Information", "Shipping Address", and "Order Summary" using fieldset elements. By grouping all of the elements in one category users of assistive technologies can understand the relationship of the elements. For example, without proper grouping a person using a screen reader might not be able to differentiate the address field for shipping from the address field for billing. Another example is when radio buttons are used as answers and a question appears above or to the left of the radio buttons. When the question text and radio buttons are not properly constructed in a fieldset users of screen readers may only be aware of the answers and not the question.\n\n[Code Reference]\n',
         keepOrig1: "true",
         var2: "[Recommendation]\nUtilize the fieldset element to group together related groups. For each fieldset element, ensure that a legend has been defined and contains an appropriate value. All of the radio buttons and checkboxes in a group should be included within a fieldset with the group name as its legend.\n\n[Compliant Code Example]\n",
         keepOrig2: "true"
      },
      {
         id: "response-formlabel",
         text: "Label",
         var1: "[Issue]\n\n\n[User Impact]\nWhen form fields do not explicitly include a label, assistive technologies may incorrectly render the label or provide no label at all to users. When labels are not present or are incorrect, users of assistive technologies may not be able to complete a form.\n\n[Code Reference]\n",
         keepOrig1: "true",
         var2: "[Recommendation]\nWhile there are several techniques for making an accessible label for the form fields, the easiest and most reliable is to have a valid HTML LABEL element that is explicitly associated with the input using the FOR/ID attributes.\n\n[Compliant Code Example]\n",
         keepOrig2: "true"
      },

      // HEADINGS
      {
         id: "response-headingsimplicit",
         text: "Implicit",
         div: "Headings",
         var1: "[Issue]\n\n\n[User Impact]\nExplicit heading markup must be used for page headings. Since some users skim through a document by navigating its headings, it is important to use headings appropriately to convey document structure. This best practice does not require adding structural headings to content that does not appear as an implicit heading. Its intent is to ensure that implicit headings are structured as explicit headings. Implicit headings are those that use font size, boldface, color, background color, extra spacing (not blank lines) or any of a wide variety of purely visual methods to imply meaning. When heading content is not created with proper markup the meaning conveyed by presentation will be lost when style sheets are turned off.\n\n[Code Reference]\n",
         keepOrig1: "true",
         var2: "[Recommendation]\nDevelopers must ensure that headers with proper markup are employed for any elements that solely use a visual effect to convey a content/section heading. HTML heading elements such as h1,h2,h3,h4,h5, and h6 must be used to specifically mark up page content that visually appears as a heading.\n\n[Compliant Code Example]\n",
         keepOrig2: "true"
      },
      {
         id: "response-headings",
         text: "Order",
         var1: '[Issue]\n\n\n[User Impact]\nDevelopers should order heading elements properly. The heading element level must match the level communicated visually by the headings on the page. Headings can be used to communicate structure as well as important content although their purpose should generally be to communicate the structure of content. For example, in HTML, h2 elements should generally follow h1 elements, h3 elements should follow h2 elements, etc. Content developers should generally not "skip" levels (e.g., h1 directly to h3). When levels are skipped, users of assistive technology may not understand the relationship of the content.\n\n[Code Reference]\n',
         keepOrig1: "true",
         var2: '[Recommendation]\nEnsure that all heading elements are used in the proper order. Headings should be used to create a structured "Table of Contents" for the user that follows a logical order. Skipping heading ranks can be confusing and should be avoided where possible: Make sure that an h2 is not followed directly by an h4, for example. It is OK to skip ranks when closing subsections, for instance, a <h2> beginning a new section, can follow an <h4> as it closes the previous section.\n\n[Compliant Code Example]\n',
         keepOrig2: "true"
      },

      {
         id: "response-headingsunnessary",
         text: "Unnessary",
         var1: "[Issue]\n\n\n[User Impact]\nHeading elements should be utilized only when necessary and primarily to mark the beginning of related sections of content. Making an effective use of headings can provide an excellent benefit to users of assistive technology, which may provide the user with a way to navigate section-by-section through content. By applying headings incorrectly, or for passages of text which do not delineate a section, users of assistive technology may be stripped of this useful navigation technique.\n\n[Code Reference]\n",
         keepOrig1: "true",
         var2: "[Recommendation]\nRemove the heading structure from heading elements that do not contain any sub-information. If headings are meant to mark up sub-information ensure that information properly follows the headings.\n\n[Compliant Code Example]\n",
         keepOrig2: "true"
      },

      // HTML
      {
         id: "response-html",
         text: "Bad",
         div: "HTML",
         var1: '[Issue]\n\n\n[User Impact]\nDocuments that use markup languages must be well-formed. When documents are not well-formed user agents and/or assistive technology may not correctly parse and render the content to users. Many major user-agents are able to cope well with "bad" markup, however, to be consistent across all platforms and browsers well-formed markup must be used. This is especially important for assistive technology which may or may not be programmed to perform the same level of "coping" that can be found in browsers.\n\n[Code Reference]\n',
         keepOrig1: "true",
         var2: "[Recommendation]\nEnsure that all page elements have complete start and end tags, elements are nested according to specification, elements do not contain duplicate attributes, and any IDs are unique (except where allowed by the document specification). Mismatched opening and closing quotes, malformed attributes, attributes not space separated, mismatched opening and closing tags, and in some cases, unquoted attributes are also violations.\n\nThe best way to know that a document meets these requirements is to run the document through the W3C's HTML validator and then review the errors/warnings.\n\nhttps://validator.w3.org/"
      },
      {
         id: "response-duplicateid",
         text: "Duplicate ID",
         var1: '[Issue]\nThere are duplicate values for ID attributes on the page. Each ID value must be unique per page. This is especially important since assistive technology will use the ID attribute to correctly identify different sections of the page.\n\n[User Impact]\nDocuments that use markup languages must be well-formed. When documents are not well-formed user agents and/or assistive technology may not correctly parse and render the content to users. Many major user-agents are able to cope well with "bad" markup, however, to be consistent across all platforms and browsers well-formed markup must be used. This is especially important for assistive technology which may or may not be programmed to perform the same level of "coping" that can be found in browsers.\n\n[Code Reference]\n',
         keepOrig1: "true",
         var2: "[Recommendation]\nEnsure that all page elements have complete start and end tags, elements are nested according to specification, elements do not contain duplicate attributes, and any IDs are unique (except where allowed by the document specification). Mismatched opening and closing quotes, malformed attributes, attributes not space separated, mismatched opening and closing tags, and in some cases, unquoted attributes are also violations.\n\nThe best way to know that a document meets these requirements is to run the document through the W3C's HTML validator and then review the errors/warnings.\n\nhttps://validator.w3.org/\n\n[Recommended Reading]\nLearn more about the ID attribute and permissible values at the W3C:\n\nhttps://www.w3.org/TR/2011/WD-html5-20110525/elements.html#the-id-attribute"
      },
      {
         id: "response-obsolete",
         text: "Obsolete",
         var1: "[Issue]\nThroughout the pages, there are depreciated HTML elements and attributes. Elements such as CENTER and FONT, and attributes such as NAME, ALIGN, VALIGN, CELLPADDING, CELLSPACING, WIDTH, HEIGHT, and BORDER should be removed from the pages.\n\n[User Impact]\nScreen readers and other assistive technology may not support deprecated HTML. Also, many of the deprecated attributes are related to styling the content on the page, which to increase compatibility with the most significant number of devices, should be moved to CSS.\n\n[Code Reference]\n",
         keepOrig1: "true",
         var2: "[Recommendation]\nReplace all depreciated/obsolete HTML elements with elements in the current standard. The best way to know that a document does not have any depreciated elements is to run the document through the W3C's HTML validator and then review the errors/warnings.\n\nhttps://validator.w3.org/\n\n[Recommended Reading]\nFor more information on depreciated items, please refer to the W3C specification for HTML5:\n\nDepreciated Elements\nhttps://www.w3.org/TR/html5-diff/#obsolete-elements\n\nDepreciated Attributes\nhttps://www.w3.org/TR/html5-diff/#obsolete-attributes"
      },

      // IMAGES
      {
         id: "response-meaingfulalt",
         text: "Meaningful ALT",
         div: "Images",
         var1: "[Issue]\n\n\n[User Impact]\nImages that convey meaning must provide informative alternative text. Alternative text that is default, non-meaningful, or otherwise incorrect, can negatively impact the accessibility of a page. The goal of alt text should be to present text which will provide the same level of understanding to those who cannot see the image as it does to those who can. Whenever possible, page developers should ensure alternative text for images is as terse, yet informative, as possible.\n\n[Code Reference]\n",
         keepOrig1: "true",
         var2: "[Recommendation]\nAlternative text should be replaced with a more informative or correct alternative text. Page developers should ensure that alt text is a concise and meaningful replacement for the image.\n\n[Compliant Code Example]\n",
         keepOrig2: "true"
      },
      {
         id: "response-missingalt",
         text: "Missing ALT",
         var1: "[Issue]\n\n\n[User Impact]\nAll images within a page must be given an alternate text equivalent. Text equivalents for non-text elements communicate the meaning of images to users who cannot perceive the image such as users of screen readers. Proper equivalents provide text which contributes the same level of understanding to the content of the page as the image itself. In instances where the image does not contribute to the understanding of the content and is purely decorative, it needs to be marked in a way to indicate its purely decorative purpose.\n\n[Code Reference]\n",
         keepOrig1: "true",
         var2: '[Recommendation]\nAdd an appropriate alt attribute for images that do not contain alt attributes. An alt attribute should be a concise and meaningful replacement for the image. For example, when describing a picture of a red balloon, entering alt="red balloon" will be more helpful than alt="This is a picture of a red balloon". The alt text of the image should be in the language of the page or if the page contains multiple languages the language of the surrounding or any referring content.\n\nIf the image does not convey any meaning (such as a spacer image, separation line, border, etc.), or if the image is redundant to adjacent text, enter a null alt attribute (alt=""). Alternatively, the image could be turned into a CSS background image.\n\n[Compliant Code Example]\n',
         keepOrig2: "true"
      },

      // KEYBOARD
      {
         id: "response-dismiss",
         text: "Dismiss Dialogue",
         div: "Keyboard",
         var1: "[Issue]\n\n\n[User Impact]\nDialogs must provide a mechanism for users to close the dialog using the keyboard. This includes the ability to navigate to the close link via the keyboard such as by tabbing or shift+tabbing. The user must also be able to activate the link or button via the keyboard.\n\n[Code Reference]\n",
         keepOrig1: "true",
         var2: '[Recommendation]\nDevelopers should ensure that the element used to close the dialog is reachable via the keyboard. Typically this would be through use of the tab or shift+tab key. Additionally, access keys such as the letter "c" with a modifier can be used to close the link. In general the access key should be in addition to ensuring the close method is in the tab order. Developers should ensure that the close link/button can be activated via the keyboard via the ENTER key. It is recommended but not required to provide an additional close link at the bottom of the dialog to allow users of assistive technology to more effectively close the dialog. This additional redundant close link can be on or off-screen and should be in the tab order.\n\n[Compliant Code Example]\n',
         keepOrig2: "true"
      },
      {
         id: "response-keyboardfunction",
         text: "Function",
         var1: "[Issue]\n\n\n[User Impact]\nAll functionality must be actionable regardless of the input method used. Navigation and functionality that is dependent on specific devices such as a mouse may not be available to users with dexterity impairments as well as people without vision or low vision. These users may not be able to use a mouse so content providers should ensure that all functionality can be used from the keyboard.\n\n[Code Reference]\n",
         keepOrig1: "true",
         var2: "[Recommendation]\n\n\n[Compliant Code Example]\n",
         keepOrig2: "true"
      },
      {
         id: "response-visiblefocus",
         text: "Visible Focus",
         var1: '[Issue]\nElements on the page do not have a visual indication focus.\n\n[User Impact]\nKeyboard only users will have difficulties understanding which interactive element is currently selected. A well-defined (highly visible) visual indication of keyboard focus needs to be provided for each active element. This position on a screen where an action or keyboard input will take place is referred to as the "focus". Providing a visual indication of the focus allows someone who is viewing the screen to determine what action to take based on what element has focus. This is particularly necessary for keyboard-only users who do not use the mouse and cannot simply click to place focus where they think it should be. The user must rely on the visual indication of focus to determine where an action will occur or determine what keystrokes to perform to move focus to the desired field. If this focus is not indicated the user will be unclear as to where the current execution focus is located and may enter incorrect information, accidentally submit a form without knowledge of what occurred, or spend extra time trying to determine where the keyboard input focus is.\n\n[Code Reference]\n',
         keepOrig1: "true",
         var2: "[Recommendation]\nDevelopers should ensure that visible keyboard focus is provided to all elements. Typically the browser will provide keyboard focus using a dotted rectangle for all standard HTML elements such as input, select, textarea, anchor, and area. When scripting is used to set focus to other elements coupled with the tabindex attribute or when the CSS outline property is set to none developers must ensure that visual focus is added by using color with border or other visual attributes.\n\n[CSS Sample]\n<style>\na:hover, a:active, a:focus, button:hover, button:active, button:focus { \n    outline: 1px dotted #ff0000; \n}</style>\n\n[Compliant Code Example]\n",
         keepOrig2: "true"
      },

      // LINKS
      {
         id: "response-linkcolor",
         text: "Color Only",
         div: "Links",
         var1: "[Issue]\n\n\n[User Impact]\nColor must not be the sole method of indicating a link within non-linked text.\n\n[Code Reference]\n",
         keepOrig1: "true",
         var2: "[Recommendation]\nThe link must possess other visual attributes upon keyboard focus such as becoming underlined. Additionally, the color of the link text and non-linked text must meet color contrast requirements for the WCAG conformance level sought.\n\n[Compliant Code Example]\na:visited, a:hover, a:active { color: #ff0000 text-decoration: underline; }\n",
         keepOrig2: "true"
      },
      {
         id: "response-linkmean",
         text: "Meaning/Dup",
         var1: '[Issue]\n\n\n[User Impact]\nIt is important for users to be able to discern the purpose of all links. Meaningful link text should not be overly general and should clearly describe the content to be found or action to be performed by the link. For example, do not use generic text such as "click here", "read more", etc. unless the purpose of the link can be determined by meaning in the surrounding content. When a link\'s purpose can not be determined users may be required to follow the link to determine its purpose. Returning to a previous location can often be more difficult for users with disabilities using assistive technology.\n\nLink text should also be unique to the target of a given link. When links with different destinations are given identical link text, this can produce confusion for users of assistive technologies, some of which provide users the ability to view a list of all links on the document. \n\n[Code Reference]\n',
         keepOrig1: "true",
         var2: "[Recommendation]\nEnsure the accessible name of each link accurately reflects the target and purpose of the link. Ideally, this can be done by changing text that is used to calculate a link's accessible name. Other methods of changing the link text include using the aria-labelledby/aria-label attributes, or by using hidden text within the link.\n\n[Compliant Code Example]\n",
         keepOrig2: "true"
      },

      // PAGE
      {
         id: "response-pagelang",
         text: "Language",
         div: "Page",
         var1: "[Issue]\nThe language of the page is not set. Developers should define the natural language of a document to ensure that screen readers and other user agents understand the language the document is to be interpreted in.\n\n[Impact]\nSpecifically, when a document contains multiple inline language choices, screen readers and other assistive technology types must know what the default language type is to ensure they can appropriately switch between languages. Per the HTML 4.01 recommendation, language declarations should be made in accordance with IETF RFC 1766.\n\n[Code Reference]\n<!DOCTYPE html>\n<html>\n<head>",
         var2: '[Recommendation]\nEnsure that the lang attribute is set within the HTML element. Always use a language attribute on the HTML element. This is inherited by all other elements, and so will set a default language for the text in the document head element.\n\nIf you have any content on the page that is in a different language from that declared in the HTML element, use language attributes on elements surrounding that content. This allows you to style or process it differently.\n\n[Compliant Code Example]\n<!DOCTYPE html>\n<html lang="en">\n<head>'
      },
      {
         id: "response-viewport",
         text: "META Viewport",
         var1: "[Issue]\nThere is a fixed size viewport.\n\n[User Impact]\nUsers, especially those with limited vision or using mobile devices, need to be able to increase the size of the textual elements on the pages. By disabling this with the viewport, users will not be able to zoom in.\n\n[Code Reference]\n",
         keepOrig1: "true",
         var2: "[Recommendation]\nRemove the maximum scale and user-scalable attributes from the viewport META element.\n\n[Compliant Code Example]\n<meta content='width=device-width; initial-scale=1.0;' name='viewport' />"
      },
      {
         id: "response-skipnav",
         text: "Skip Nav",
         var1: "[Issue]\nThere is no way to skip past the navigation elements.\n\n[User Impact]\nRepetitive content found on a set of pages requires a method to allow a user to skip past it, so the user can get to the page's main/unique content as efficiently as possible. For example, consider a user who is blind using a screen reader or a keyboard-only user. Each time the user accesses a new page in a site with a top navigation bar, the user would be forced to navigate past e.g. tab through all of these navigation links (and other content) before getting to the main content area of the page. This makes it difficult to access the page's main/unique information efficiently.",
         var2: '[Recommendation]\nProvide a valid skip link that directs users to the unique content of each page. This can be hidden, but needs to become visual when focused upon.\n\n[Compliant Code Example]\n<style>\n\n   #skip a { position:absolute; left:-10000px; top:auto; width:1px; height:1px; overflow:hidden; }\n\n   #skip a:focus { position:static; width:auto; height:auto; }\n\n</style>\n\n<div id="skip">\n   <a href="#main">Skip to Main Content</a>\n</div>\n\n[Recommended Reading]\nRead more about creating skip navigation links from WebAIM:\nhttps://webaim.org/techniques/skipnav/'
      },
      {
         id: "response-pagetitle",
         text: "Title",
         var1: "[Issue]\n\n\n[User Impact]\nThe title of a page must provide information specific to the currently viewed page. Assistive technologies utilize the page title to indicate the current page location to users without the user having to navigate within the page. Because assistive technology often reads the page title first, this content should inform the user of the content to be found (topic) or action to be performed on (purpose of) that page.\n\n[Code Reference]\n",
         keepOrig1: "true",
         var2: "[Recommendation]\nEnsure that the value for the title element is updated as the page content changes. The title element should be terse yet informative and contain information which discloses the content to be found or action to be performed on that page and should avoid containing extra information that does not aid in this understanding. The title of the page should be in the primary language of the page.\n\n[Compliant Code Example]\n",
         keepOrig2: "true"
      },

      // TABLES
      {
         id: "response-tablerow",
         text: "Row TH",
         div: "Tables",
         var1: "[Issue]\n\n\n[Impact]\nTable row cells that act as header cells for a row of data need to communicate this programmatically. Row header cells are often identified visually by boldface or other differences in color/font compared to data cells (though this is less common than for column header cells). When table row headers do not communicate their status as headers, assistive technology such as screen readers may not announce the correct row header cells when users navigate up/down columns of data.\n\n[Code Reference]\n",
         keepOrig1: "true",
         var2: "[Recommendation]\nMake sure th elements are used for cells that represent row headers. In addition, add the scope attribute with a value of row. This requirement is particularly critical if the row header cells are not in the first column.\n\n[Compliant Code Example]\n",
         keepOrig2: "true"
      }
   ];
   return response;
}

function dataTemplate() {
   var template = [
      
      // Blank Template
      {
        id: "template-level",
        text: "Blank",
        div: "Level Access",
        var1: "[Issue]\n\n\n[User Impact]\n\n\n[Code Reference]\n",
        keepOrig1: "true",
        var2: "[Recommendation]\n\n\n[Compliant Code Example]\n",
        keepOrig2: "true"
      },
      // Wells Fargo
      {
        id: "template-wells-64assets",
        text: "64 Assets",
        div: "Wells Fargo",
        var1: "[Summary]\nADA_ one line, as before\n\n*Page/Component Name*\nModule Name, URL if applicable\n\n*Issue*\nsame as BAU audits, but can be less detailed if time-consuming to diagnose\n\n*Devices*\nDesktop/Phone/Tablet/Platform/App/Browser, Environment, App Build# if applicable\n\n*Pattern*\nPattern Name; uncertain if/how this AMP column is handled; delete if none\n\n",
        keepOrig1: "true",
        var2: "[Severity]\nJust the number, Severity 1-3\n\n*Fix Priority only if Sev 3*\nPriority 1 or Priority 2 or Priority 3\n\n*Screenshot in AMP?*\nYes/No\n\n*Recommended Changes*\n\n",
        keepOrig2: "true" 
      },
      {
         id: "template-wells",
         text: "Greenhouse",
         var1: "[Headline]\nADA_\n\n[Issue]\n\n[Build]\ngreenhouse-live-debug-R2019.12.00 #22 environment rqa\n\n[AMP]\nhttps://amp.levelaccess.net/public/reporting/view_module.php?module_id=15630518\n\nSeverity:\n\nPriority:\n\n[Expected Behavior]\n\n",
         keepOrig1: "true",
         var2: "",
         keepOrig2: "true"
      },   ];
   return template;
}

function dataCSS() {
   var cssArray = {
      // General CSS
      ".kpmAlt": "font-size: 0.8em;",
      ".kpmSmall": "font-size: 0.9em; line-height: 0.8em;",
      ".kpmButton": "margin: 0 0 0 0.25em !important;",
      ".kpmP": "margin: 0.25em 0 0.1em 0 !important; font-weight: bold !important",
      'select[id^="violation_"]': "z-index: 1;",
      "#cancel": "background-color: #ff0000 !important; background-image: none !important;",
      "#cancel:hover": "background-color: #ddd !important; background-image: none !important;",

      // Change Level styles
      "td.actions": "text-align: right !important",
      "td.actions a": "padding: 0; margin: 0.25em 0 0 0;",
      ".large td, .ssb-datatable td, tbody th": "vertical-align: top !important;",
      "#menu_table_toolbar_actions a:hover": "text-decoration: none;",
      ".infopop": "display: none;",

      // New truncate on patterns
      "#view_violations_container .truncate": "text-overflow: ellipsis; overflow: visible !important; white-space: pre-wrap !important;",

      // Go to pattern buttons
      ".kpmGoToPattern": "margin-right: 3px !important;",

      // Inserted Header Links
      "a.kpmHeaderAnchor": "color: #fff; margin-right: 1em; font-size: 1.25em; font-weight: bold;",
      "a.kpmHeaderAnchor:hover": "color: #82E51C; text-decoration: none;",
      "a.kpmAnchor:hover": "background-color: #82E51C;",

      // Best Practice Buttons - Header Cells
      "th .modalButtons": "color: #fff; float: right; background-color: #552c9f; padding: 2px 2px; border-radius: 4px; margin: 0; font-size: 1.2em;",
      "th .modalButtons a": "min-height: 1em; min-width: 1em; color: #fff; margin: 0.5em;",
      "th .modalButtons a:hover": "color: #552c9f; outline: 1px solid #552c9f;",

      // Best Practice Buttons - Data Cells
      "td .modalButtons": "display: inline-block; color: #666; padding: 0; margin: 0; font-size: 1.2em;",
      "td .modalButtons a": "min-height: 1em; min-width: 1em; color: #666; margin: 0 0.25em;",
      "td .modalButtons a:hover": "color: #552c9f;",

      // Preferences Box
      ".kpmPrefsDiv": "clear: both; width: 100% !important; height: auto !important; min-height: auto !important; margin-top: 0.5em;",
      ".kpmPrefsDiv table, .kpmPrefsDiv table tr, .kpmPrefsDiv table td": "border: none !important; background: none !important;",
      ".kpmPrefsDiv table": "margin: 0; padding: 0; font-size: 0.9em;",
      ".kpmPrefsDiv td": "vertical-align: top; width: 33%; padding: 0.5em; height: auto !important;",
      ".kpmPrefsDiv td label": "font-weight: normal !important",
      "#kpmPrefs ul": "list-style-type: disc !important; margin: 0 0 0 1.4em;",
      "#kpmPrefs ul li ul": "list-style-type: circle !important; margin: 0 0 0 1em;",
      "#kpmPrefs .heading_container a:hover": "color: #82E51C; text-decoration: none;",
      "#kpmPrefs p": "margin: 0 !important; padding: 0 !important;",

      // Warnings about content
      ".kpmAlert, .kpmAlert2": "margin: 0 0 0.2em 0 !important; padding: 0.25em !important; font-weight: bold; font-size: 0.9em;",
      ".kpmAlert": "color: #000 !important; background-color: #5cd344;",
      ".kpmAlert2": "color: #ffffff !important; background-color: #552c9f;",

      // Buttons
      "button:focus, a:focus, input:focus, select:focus, select > option:focus": "text-decoration: underline; outline: 3px solid #000;",
      ".kpmFirstButton": "margin: 0 !important; padding: 0.25em !important;",

      // Dropdown Navigation on add modal
      "#kpmNav, #kpmNav nav, #kpmNav ul, #kpmNav li": "z-index: 1000 !important;",
      "#kpmNav": "margin-top: 1em; margin-bottom: 1em;",
      "#kpmNav a": "text-decoration:none;",
      "#kpmNav ul": "background:#d7d7d7;list-style:none;margin:0;padding:0;",
      "#kpmNav li": "font-weight:bold; color:#000; background:#d7d7d7; display:block; float:left; padding:0.1rem; position:relative; text-decoration:none; transition-duration:0.5s; min-width:7rem; border:1px solid #000; border-right:none; text-align:center;",
      "#kpmNav li:last-child": "border-right: 1px solid #000;",
      "#kpmNav li a": "color:#000;",
      "#kpmNav li:hover, #kpmNav li:focus-within": "background:#5cd344; cursor:pointer;",
      "#kpmNav li:focus-within a": "outline:none;",
      "#kpmNav ul li ul": "background:#3359ec; visibility:hidden; opacity:0; min-width:7rem; position:absolute; transition:all 0.5s ease; margin-top:0.1rem; left:0; display:none;",
      "#kpmNav ul li:hover > ul, #kpmNav ul li:focus-within > ul, #kpmNav ul li ul:hover, #kpmNav ul li ul:focus": "visibility:visible; opacity:1; display:block;",
      "#kpmNav ul li ul li": "border:1px solid #000; border-bottom: none; line-height:0.8em; clear:both; width:100%; padding:0.3em; margin:0; text-align:left; font-weight:normal;",
      "#kpmNav ul li ul li:last-child": "border-bottom: 1px solid #000;",
      "#kpmNav ul li ul li.divider": "color:#fff; font-weight:bold; margin:0; padding:0.2em; background:#552c9f; text-align:center;",
      "#ampOptsInpt": "margin-bottom: 0.3em; width: 100%;",

      // Show Instances by BP Name
      ".bpHide": "display: none!important;",
      ".kpmFilterWraper": "margin: 1.5em 0 0 .25em; padding: 0.1em; float: right; width: 20%; text-align: center; border: 1px solid #d3d7dd; border-radius: 3px;",
      ".kpmFilterWraper input": "margin: 0.1em 0 .25em 0;",

      // Baseline Checklist
      "#kpmBaseline": "float: right !important; width: 30% !important; background-color: #fff !important;",
      "#kpmBaseline legend": "display: inline !important;",
      "#kpmBaseline legend a": "margin-left: 1em !important;",
      "#kpmBaseline legend a:hover": "text-decoration: none !important; background-color: #eee;",
      "#kpmBaseline #kpmBaselineBox": "overflow: auto !important; height: 10em !important;",
      "#kpmBaseline #kpmBaselineBox ul": "list-style-type: square !important; font-size: 0.7em !important; margin: 0 0 0 1em !important;",
      "#kpmBaseline #kpmBaselineBox ul li": "margin-left: 1em !important;",
      "#kpmBaseline #kpmBaselineFooter": "text-align: center !important; border-top: 1px solid #eee !important;",

      // Description Area Checkbox
      "#kpmDescPref": "float: right !important;",
      "#kpmDescPref label": "font-size: 0.6em !important; font-weight: normal !important;"
   };
   // Description box on dashboard.
   if (!getCookieValue("kpmPref-fullDescription")) {
      cssArray[".content_container"] =
         "grid-template-rows: auto auto !important;";
      cssArray[".description"] = "height: auto !important;";
   }
   return cssArray;
}

function dataBaseline () {
   var blArray = [{
      key: "keyboardAccess",
      title: "Keyboard Access and interaction",
      subs: [
         "Ensure all interactive functionality is operable with the keyboard"
      ]
   },
   {
      key: "keyboardTrap",
      title: "Keyboard Trap",
      subs: ["Ensure keyboard focus is not trapped"]
   },
   {
      key: "focusOrder",
      title: "Focus Order",
      subs: [
         "Ensure the focus order of interactive elements on the page is logical"
      ]
   },
   {
      key: "focusVisible",
      title: "Focus Visible",
      subs: ["Ensure keyboard focus is indicated visually"]
   },
   {
      key: "focusIssues",
      title: "Focus Issues/movement on interaction",
      subs: [
         "Ensure content updates define focus updates appropriately",
         "Avoid using event handlers that trigger focus or context changes on user input",
         "Avoid forced focus changes that are not user-initiated"
      ]
   },
   {
      key: "content",
      title: "Repetitive Content, link purpose, consistency, and multiple ways",
      subs: [
         "Ensure link text is meaningful within context",
         "Provide a mechanism for skipping past repetitive content",
         "Ensure there is more than one way to locate a web page in a set of pages",
         "Ensure that elements with the same functionality are consistently identified across pages",
         "Ensure pages use a consistent navigation structure"
      ]
   },
   {
      key: "interactiveElements",
      title: "Information for all interactive elements including forms and frames",
      subs: [
         "Provide fieldsets for groups of form controls",
         "Ensure page tabs provide state and role",
         "Ensure custom controls provide proper textual name, role, and state information",
         "Ensure form field constraints and errors are associated with their corresponding field",
         "Ensure radio button groups are properly formed",
         "Provide visual labels or instructions for user input",
         "Ensure dialogs use proper structure",
         "Ensure ARIA roles, states, and properties are valid"
      ]
   },
   {
      key: "errorConditions",
      title: "Error conditions and Instructions",
      subs: [
         "Provide suggestions for error messages when known",
         "Provide error prevention for legal commitments, financial transactions, test responses, and data changes",
         "Provide a clear indication of fields in error for information that is submitted",
         "Ensure instructions do not rely solely on sensory characteristic"
      ]
   },
   {
      key: "imageEquivalent",
      title: "Image equivalents, including background images, pseudo elements, and icon fonts",
      subs: [
         "Ensure images provide informative alternative text",
         "Ensure CSS background images that convey meaning have textual and visible equivalents",
         "Provide text equivalents for icon fonts"
      ]
   },
   {
      key: "imagesText",
      title: "Images of text",
      subs: [
         "Ensure text is used instead of images of text when technology allows unless it is essential"
      ]
   },
   {
      key: "videoAudio",
      title: "Video-only/Audio-only",
      subs: [
         "Provide a text transcript for audio only presentations",
         "Provide text transcript or audio track of video only presentation"
      ]
   },
   {
      key: "captions",
      title: "Captions and audio descriptions",
      subs: [
         "Provide synchronized audio description for video (which includes audio) or other multimedia",
         "Provide synchronized captions for video (which includes audio) or other multimedia"
      ]
   },
   {
      key: "colorDependence",
      title: "Color Dependence",
      subs: ["Ensure color is not the sole means of communicating information"]
   },
   {
      key: "contrast",
      title: "Contrast",
      subs: ["Ensure text and images of text provide sufficient contrast"]
   },
   {
      key: "pageTitles",
      title: "Page Titles",
      subs: ["Provide an informative context-sensitive page title"]
   },
   {
      key: "headings",
      title: "Heading Presence and Order",
      subs: [
         "Avoid the use of implicit headings",
         "Ensure heading level matches the heading's visual importance/level"
      ]
   },
   {
      key: "listItems",
      title: "List Items",
      subs: ["Ensure implicit list markup is avoided"]
   },
   {
      key: "readingOrder",
      title: "Reading Order and off-screen hidden content",
      subs: [
         "Ensure content that is intended to be hidden from all users is not rendered by assistive technology",
         "Ensure that the reading order of content is logical"
      ]
   },
   {
      key: "languageParts",
      title: "Language of Parts",
      subs: ["Ensure changes in natural language are identified inline"]
   },
   {
      key: "tableStructure",
      title: "Table structure and association of headers",
      subs: [
         "Ensure data table headers are properly identified",
         "Ensure data tables are formatted using table elements",
         "Ensure layout tables do not contain structural markup"
      ]
   },
   {
      key: "liveRegions",
      title: "Live Regions",
      subs: ["Indicate live regions for dynamically changing content"]
   },
   {
      key: "animatedContent",
      title: "Pause , stop, or hide of animated or moving content including media",
      subs: [
         "Ensure auto-updating dynamic content can be paused, stopped, or hidden"
      ]
   },
   {
      key: "flashing",
      title: "Flashing",
      subs: ["Ensure elements blink or flash in a safe threshold"]
   },
   {
      key: "timeOuts",
      title: "Time Outs",
      subs: [
         "Ensure accessible usage of time based sessions and timed responses"
      ]
   },
   {
      key: "resizeText",
      title: "Resize Text (zoom)",
      subs: ["Ensure text can be resized"]
   },
   {
      key: "parsing",
      title: "Parsing",
      subs: ["Ensure markup documents contain well-formed elements"]
   },
   {
      key: "conformanceRequirements",
      title: "Conformance Requirements",
      subs: [
         "Ensure pages that provide alternatives for non-accessible pages provide equivalent functionality",
         "Ensure non-interference of non-conforming or non-accessibility supported technology"
      ]
   }
   ];
   return blArray;
}

function dataErrors () {
   var array = [{
      css: "data-la-",
      cause: "Access Assistant"
   },
   {
      css: "data-aria508-",
      cause: "ANDI"
   },
   {
      css: "data-andi508-",
      cause: "ANDI"
   },
   {
      css: "lpform",
      cause: "LastPass"
   },
   {
      css: "_lpchecked",
      cause: "LastPass"
   },
   {
      css: "wave5icon",
      cause: "WAVE Tool"
   },
   {
      css: "wiid",
      cause: "JAWS Inspect Plugin"
   }
   ];
   return array;
}

/* Experimental stuff I am working on */

// EXPERIMENTAL: use Ajax to grab something from another page
function ajaxCall(url, css) {
   var output;
   $.ajax({
      type: "POST",
      url: url,
      async: false,
      success: function (result) {
         output = $(result).find(css).html();
      }
   });
   return output;
}

/* General Tools and utilities for the scripts */

// TOOL: Finds the report ID either in the URL or searches the page
function getID(sPageURL, sKey) {
   var thisID;
   if (sPageURL.search(sKey) < 0 && $("a[href*='" + sKey + "']")) {
      sPageURL = $("a[href*='" + sKey + "']:last").attr("href");
   }
   var urlParam = function (name) {
      var results = new RegExp("[?&]" + name + "=([^&#]*)").exec(sPageURL);
      if (results) {
         return results[1] || 0;
      }
   };
   if (urlParam(sKey)) {
      thisID = urlParam(sKey);
   }
   return thisID;
}

// TOOL: Simple function for building a link that gets injected in the header
function buildLink(text, url) {
   var Anchor = document.createElement("a");
   var Text = document.createTextNode(text);
   Anchor.appendChild(Text);
   Anchor.href = url;
   Anchor.className = "kpmHeaderAnchor";
   return Anchor;
}

// TOOL: Function for getting a cookie value based on the cookie ID.
function getCookieValue(a) {
   var b = document.cookie.match("(^|[^;]+)\\s*" + a + "\\s*=\\s*([^;]+)");
   return b ? b.pop() : "";
}

// TOOL: Simple function for hiding elements based on CSS decloration.
function hideElement(css, closest) {
   if (closest) {$(css).closest(closest).hide(); }
   else {$(css).closest(closest).hide();}
}

// TOOL: Build CSS
function buildCSS(array) {
   var CSS = "";
   $.each(array, function (key, value) {
      CSS += key + " {" + value + "} ";
   });
   return "<style>" + CSS + "</style>";
}

/* GLoabls: Things that appear on every page */

// GLOBAL: Adds links to the main nav
function mainNav(reportID, moduleID) {
   var linksDIV = document.createElement("span");
   linksDIV.id = "kpmScriptRunning";
   linksDIV.style = "margin-left: 2em;";
   linksDIV.appendChild(buildLink("Dashboard","/public/reporting/view_report.php?report_id=" + reportID));
   linksDIV.appendChild(buildLink("Modules","/public/reporting/view_modules.php?report_id=" + reportID));
   linksDIV.appendChild(buildLink("Patterns","/public/reporting/view_globals_and_patterns.php?report_id=" + reportID));
   linksDIV.appendChild(buildLink("Violations","/public/reporting/view_instances.php?report_id=" + reportID));
   linksDIV.appendChild(buildLink("Use Cases","/public/reporting/view_use_cases.php?report_id=" + reportID));

   // If a module ID is present, then add two links to the module. Also adds a link to "mark complete"
   if (location.href.search("module_id") >= 0 && location.href.search("view_module.php") < 0) {
      linksDIV.appendChild(buildLink("* Edit Module/Instances *","/public/reporting/view_module.php?module_id=" + moduleID ));
   }
   return linksDIV;
}

/* Multi Page: Things that are used in multiple plaaces */

// MULTI PAGE: Function to search for errors and create error messages on TD or Textarea fields
function injectWarning(data) {
   var array = dataErrors();
   var alert = "";
   var lastChar = data.text().trim().slice(-1);
   var firstChar = data.text().trim().slice(0, 1);
   var i = 0;
   for (i = 0; i < array.length; i++) {
      if (data.text().match(array[i].css)) {
         alert +='<p class="kpmAlert">Warning: Contains "' + array[i].css +'" attribute (Injected by ' + array[i].cause + ")</p>";
      }
   }
   var warning = "";
   if (data.text().match("]\n\n\n")) {
      warning += "Has an empty section heading ([****]). ";
   }
   if (lastChar === "]") {
      warning += "Ends with a brace (Probable unfinished [Code Reference]). ";
   }
   if (firstChar === "<") {
      warning += "Leads with HTML (Probable automatic that needs editing). ";
   }
   if (warning) {
      alert += '<p class="kpmAlert2">Warning: ' + warning + "</p>";
   }
   return alert;
}

// MUTLI PAGE: Function for building the best practice buttons
function buildIcon(thisTitle, thisClass, thisURL, thisID) {
   var anchor = document.createElement("a");
   var span = document.createElement("span");
   span.className = thisClass;
   anchor.appendChild(span);
   anchor.href = thisURL;
   anchor.title = thisTitle;
   anchor.className = "kpmAnchor";
   anchor.id = thisID;
   return anchor;
}

// MULTI PAGE: Build a checkbox with set cookie capabilities for the preferences.
function buildCheckbox(id, text, tooltip, spanID) {
   var cb = document.createElement("input");
   var cbLabel = document.createElement("label");
   var cbText = document.createTextNode(" " + text);
   var br = document.createElement("br");
   var thisID = "kpmPref-" + id;
   var cbCookie = getCookieValue(thisID);
   if (tooltip) {
      cbLabel.title = tooltip;
   }
   cb.type = "checkbox";
   cb.id = thisID;
   cb.value = "no";
   if (!cbCookie) {
      cb.setAttribute("checked", "checked");
   }
   cbLabel.appendChild(cb);
   cbLabel.appendChild(cbText);

   if (spanID) {
      var cbSpan = document.createElement("span");
      cbSpan.id = spanID;
      cbSpan.appendChild(cbLabel);
      return cbSpan;
   } else {
      cbLabel.append(br);
      return cbLabel;
   }
}

// MULTI PAGE: Builds the script preferences box for the bottom of the page.
function preferencesBox() {
   var prefDiv = document.createElement("div");
   var prefHeadingDiv = document.createElement("div");
   prefHeadingDiv.className = "heading_container";
   prefHeadingDiv.innerHTML =
      '<a href="https://level-access.slack.com/messages/CK79W4PPU/" style="float: right;" target="_blank">Release Notes and Discussion <span class="sr-only">Opens in New Window</span></a><h3 style="width: 100%">AMP Script Preferences</h3>';
   prefHeadingDiv.id = "kpmPrefHeading";
   prefDiv.id = "kpmPrefs";

   var prefTable = document.createElement("table");
   prefTable.setAttribute("role", "presentation");
   var prefTR = document.createElement("tr");
   var prefTD1 = document.createElement("td");
   var prefTD3 = document.createElement("td");
   var prefTD4 = document.createElement("td");
   prefTD4.setAttribute("rowspan", "2");
   prefTD4.innerHTML = '<p>The following are also injected but have no on/off preference (* or the preference is set on the element):</p><ul><li>Add Responses (Instance and Pattern Modal)</li><li>Test Module Page opens to Review by default (instead of blank)</li><li>CSS Fixes (vertical align on tables, etc.)</li><li>Additional choices in "Show XXX Entries" (5,10,500,1000)</li><li>Access Keys (View Module/View Pattern)</li><li>Links<ul><li>Main header (5 +1 on test module)</li><li>Mark Complete (View Module/Test Module)</li><li>Edit Module (2x on Test Module)</li><li>Add Instance (View Module/View Pattern)</li><li>Add Pattern (View Module)</li></ul></li><li>Client View *</li><li>Baseline Checklist *</li><li>Colorize row based on status *</li><li>Expand Description Box on Dashboard *</li></ul>';

   var secondTR = document.createElement("tr");
   var secondTD = document.createElement("td");
   secondTD.setAttribute("colspan", "2");
   secondTD.innerHTML = "<p>Do you need to run this on a client system that doesn't allow the use of TamperMonkey? Bookmark this link <a href=\"javascript:void((function(){ampScript=document.createElement('script');ampScript.setAttribute('src','https://nva11y.com/scripts/AMPAddInstance.js');document.body.appendChild(ampScript)})());\">AmpScript</a> and you should be able to run it from anywhere. Note: You have to run it again after each page change in AMP and (for now) you have to run it <em>after</em> you activate the Add Instance modal.</p>";
   secondTR.appendChild(secondTD);

   prefDiv.appendChild(prefHeadingDiv);
   prefDiv.className = "kpmPrefsDiv SSBWidget_Container box_shadow";
   prefTD1.appendChild(document.createElement("h3")).appendChild(document.createTextNode("Add/Edit Instance Modal"));
   prefTD1.appendChild(buildCheckbox("hideNew","Hide unused fields","Hides the fields added Febuary 2019 such as 'Content Identifier' and 'User Impact'"));
   prefTD1.appendChild(buildCheckbox("showOne","Hide instances 2-6 on add","Add instance will only show a single item rather than a list of 6"));
   prefTD1.appendChild(buildCheckbox("addWarning","Add content warnings (add/edit)","Adds warnings to the modal for injected classes and missing information"));

   prefTD1.appendChild(buildCheckbox("bpListCompact","Use compact BP List","Compact best practices list in the add modal"));

   prefTD1.appendChild(document.createElement("h3")).appendChild(document.createTextNode("Instance Tables"));
   prefTD1.appendChild(buildCheckbox("addPatternLink","Add link to pattern edit","Adds a button to each pattern in the table that takes you to the edit pattern page"));
   prefTD1.appendChild(buildCheckbox("thumbALT","Add thumbnail ALT","Exposes the ALT text of screen shots"));
   prefTD1.appendChild(buildCheckbox("tableWarning","Add content warnings (tables)","Adds warnings to the table for injected classes and missing information"));
   prefTD1.appendChild(buildCheckbox("addPatterns","Add Patterns","Adds the table of patterns to the bottom of the view module page"));

   prefTD3.appendChild(document.createElement("h3")).appendChild(document.createTextNode("General"));
   prefTD3.appendChild(buildCheckbox("globals","Hide globals (patterns)","In the paterns edit, globals are hidden"));
   prefTD3.appendChild(buildCheckbox("instanceFilter","Add filter instances by name","On the edit modal page, adds a search by best practice"));
   prefTD3.appendChild(buildCheckbox("addBPLink","Add best practice links","Adds links everywhere there is a best practice modal to the best practice page"));
   if (getCookieValue("kpmPref-showBaseline")) {
      prefTD3.appendChild(buildCheckbox("showBaseline","Add baseline checklist","Shows/Hides the baseline checklist"));
   }
   prefTD3.appendChild(document.createElement("h3")).appendChild(document.createTextNode("Script Elements"));
   prefTD3.appendChild(buildCheckbox("hidePrefs","Add AMP script preferences","Hides Kevin's AMP script preferences box"));
   if (getCookieValue("kpmPref-hideAlertBox")) {
      prefTD3.appendChild(buildCheckbox("hideAlertBox","Show the alert box","Shows/Hides the alert box when present"));
   }

   prefTR.appendChild(prefTD1);
   prefTR.appendChild(prefTD3);
   prefTR.appendChild(prefTD4);
   prefTable.appendChild(prefTR);
   prefTable.appendChild(secondTR);
   prefDiv.appendChild(prefTable);
   return prefDiv;
}

// MULTI PAGE: Show ALT Text on thumbnails
function viewAltText() {
   $("td img").each(function () {
      var thisImage = $(this);
      var altText = thisImage.attr("alt");
      var imgP = document.createElement("p");
      var imgTxt = document.createTextNode("ALT: " + altText);
      imgP.className = "kpmAlt";
      imgP.appendChild(imgTxt);
      thisImage.after(imgP);
   });
}

// MULTI PAGE: Show TITLE on DIVS that are background images (Like viewAltText function above)
function viewDivAltText() {
   $("div [class='thumbnail']").each(function () {
      var thisTD = $(this);
      var thisTitle = $(this).attr("title");
      thisTD.after("<p class=\"kpmAlt\">ALT:" + thisTitle + "</p>");
   });
}

// MULTI PAGE: Add links for Best Practices
function bestPracticeLinks() {
   $("a[onclick^='modal_best_practice']").each(function () {
      var EditPattern = $(this);
      var PatternOnClick = EditPattern.attr("onclick");
      var BPID = PatternOnClick.split(", ")[1];
      var reportID2 = PatternOnClick.split(", ")[2];
      reportID2 = reportID2.split(")")[0];
      var div = document.createElement("div");

      var thisURL =
         "/public/standards/view_best_practice.php?violation_id=" + BPID + "&report_id=" + reportID2;
      var completeURL = location.protocol + "//" + location.host + thisURL;

      var goAnchor = buildIcon(
         "Go to BP " + BPID,
         "fas fa-external-link-alt fa-w-16 medium",
         thisURL,
         "goto" + BPID
      );
      var copyAnchor = buildIcon(
         "Copy BP " + BPID,
         "far fa-copy fa-w-16 medium",
         thisURL,
         "copy" + BPID
      );

      div.appendChild(goAnchor);
      div.appendChild(copyAnchor);
      div.className = "modalButtons";
      EditPattern.after(div);

      // Copy alert window if copyID was passed
      $("#copy" + BPID).click(function (e) {
         e.preventDefault();
         alert("Copied Best Practice URL\n\n" + completeURL);
         var temp = $("<input>").val(completeURL).appendTo("body").select();
         document.execCommand("copy");
         temp.remove();
      });
   });
}

/* Client View specific functions */

// CLIENT VIEW: The whole list of hidden elements for client view.
function clientHide() {
   // TODO: Turn this into a multidemensional array
   // Items with a closest LI that needs to be hidden
   var li = [
      '#container nav ul li a[title="Guidance"]',
      '#container nav ul li a[title="Toolbox"]',
      '#container nav ul li a[title="University"]',
      '#container nav ul li a[title="Administration"]',
      "#subnav_icon_container a:not(#BookmarkPage_Button)"
   ];

   // Items with a closest TD that needs to be hidden
   var td = [
      'table[id*="view_module"] div[class="checkbox-wrapper"]',
      '#view_patterns_container div[class="checkbox-wrapper"]'
   ];

   // Items with a closest TH that needs to be hidden
   var th = [
      'table[id*="view_module"] div[class="checkbox-wrapper"]',
      '#view_patterns_container div[class="checkbox-wrapper"]'
   ];

   // Items without a closest element that needs to be hidden
   var none = [
      "#secondary-header div",
      'table[id*="view_module"] td[class*="actions"]',
      'table[id*="view_module"] th[class="actions"]',
      "#MODULE_TAB_CONFIRMED-content div.bulk_actions_container",
      '#modules_wrapper a[class="dt-button"]',
      '#instances_wrapper a[class="dt-button left"]',
      "#view_use_cases_container div.linear_table_header",
      "#view_use_cases_container div.bulk_actions_container",
      "#edit-instances",
      "#delete-instances",
      ".bulk_actions_container",
      "#toggle-report-view-wrapper",
      'label[for="toggle-report-view"'
   ];
   var i = "0";
   for (i = 0; i < li.length; i++) {
      hideElement(li[i], "li");
   }
   for (i = 0; i < td.length; i++) {
      hideElement(td[i], "td");
   }
   for (i = 0; i < th.length; i++) {
      hideElement(th[i], "th");
   }
   for (i = 0; i < none.length; i++) {
      hideElement(none[i]);
   }
}

/* Test Module Specific Functions */

// TEST MODULE: Adds links to the Test Moudle Table Top
function testModuleLinks(moduleID) {
   var editLink = '<li><a href="/public/reporting/view_module.php?module_id=' + moduleID + '">Edit Module/Instances</a></li>';
   editLink += '<li><a href="#" onclick="instHandler.showModule(); return false;">Mark Complete<span class="accessibleAltText">Opens separate pane</span></a></li>';
   return editLink;
}

/* View Module Specific Functions */

// VIEW MODULE: Baseline Checklist
function baseLine(id) {

   var blArray = dataBaseline();
   var showDetailsKey = "kpmChecklist-details-" + id;
   var showCompletedKey = "kpmChecklist-show-" + id;

   var i = 0;
   var output = "";
   output += '<fieldset id="kpmBaseline">';
   output += '<legend>Baseline Checklist <a href="#" id="kpmPref-showBaseline">[ Hide ]</a></legend>';
   output += '<div id="kpmBaselineBox">';

   for (i = 0; i < blArray.length; i++) {
      var thisKey = "kpmChecklist-" + id + "-" + blArray[i].key;

      if (!getCookieValue(thisKey) || getCookieValue(showCompletedKey)) {
         output += '<label><input id="' + thisKey + '" type="checkbox"';
         if (getCookieValue(thisKey)) {
            output += ' checked="checked"';
         }
         output += ">";
         output += blArray[i].title;
         output += "</label><ul>";
         if (getCookieValue(showDetailsKey)) {
            $.each(blArray[i].subs, function (k, m) {
               output += "<li>" + m + "</li>";
            });
         }
         output += "</ul>";
      }
   }
   output += '</div><div id="kpmBaselineFooter">';
   if (getCookieValue(showDetailsKey)) {
      output += '<a href="#" id="' + showDetailsKey + '">Hide Details</a>';
   } else {
      output += '<a href="#" id="' + showDetailsKey + '">Show Details</a>';
   }
   output += "&nbsp;|&nbsp;";
   if (getCookieValue(showCompletedKey)) {
      output += '<a href="#" id="' + showCompletedKey + '">Hide Completed</a>';
   } else {
      output += '<a href="#" id="' + showCompletedKey + '">Show Completed</a>';
   }
   output += "&nbsp;|&nbsp;";
   output += '<a href="https://level-access.slack.com/messages/CK79W4PPU/" target="_blank">Checklist Notes</a>';
   output += "</div></fieldset>";
   return output;
}

// VIEW MODULE: Create filters by BP [ALEX]
function filterBP() {
   var wrapperDiv = document.createElement("div");
   wrapperDiv.className = "kpmFilterWraper";
   var searchField = document.createElement("input");
   var searchText = "Filter BPs by Name";
   searchField.type = "search";
   searchField.id = "violationDynamicFilter";
   var searchLbl = document.createElement("label");
   searchLbl.setAttribute("for", "violationDynamicFilter");
   searchLbl.innerText = searchText;
   searchLbl.className = "sr-only";
   searchField.placeholder = searchText;

   var filterBtn = document.createElement("button");
   filterBtn.id = "quickBPFilter";
   filterBtn.innerText = "Apply";
   filterBtn.className = "kpmFirstButton";

   var clearBtn = document.createElement("button");
   clearBtn.id = "clearBPFilter";
   clearBtn.innerText = "Clear";
   clearBtn.className = "kpmFirstButton";

   wrapperDiv.appendChild(searchLbl);
   //wrapperDiv.appendChild(document.createElement("br"));
   wrapperDiv.appendChild(searchField);
   wrapperDiv.appendChild(document.createElement("br"));
   wrapperDiv.appendChild(filterBtn);
   wrapperDiv.appendChild(clearBtn);

   // wrapperDiv += searchLbl + searchField + filterBtn + clearBtn;
   filterBtn.addEventListener("click", function (evt) {
      filterClearBPs(searchField.value);
   });

   clearBtn.addEventListener("click", function (evt) {
      filterClearBPs();
      searchField.value = "";
   });
   return wrapperDiv;
}

// VIEW MODULE: Filter modules list by BP [ALEX]
function filterClearBPs(ipt) {
   var temp = ipt;
   console.log("ipt is ", ipt);
   if (ipt !== null && typeof ipt !== "undefined") {
      console.log("ipt is ", ipt);
      var reg = new RegExp(temp, "ig");
      /* uncheck and disable the main header checkbox for all violations to prevent mass deletion*/
      document.querySelector(
         "table[id*='view_module'] input[type='checkbox']"
      ).checked = false;
      document.querySelector(
         "table[id*='view_module'] input[type='checkbox']"
      ).disabled = true;

      [].slice.call(
            document.querySelector("table[id*='view_module']").querySelectorAll("tr.odd, tr.even")
         ).forEach(function (elem) {
            /* Hide all rows and then unhide the ones that have matches*/
            elem.classList.add("bpHide");
            /*uncheck all checkboxes so that we can't accidentally bulk-delete visually hidden violations */
            [].slice.call(elem.querySelectorAll("td:first-child input[type='checkbox']")).forEach(function (chx) {
                  console.log("checked???", chx.checked);
                  chx.checked = false;
               });
            console.log("elem is ", elem);

            if (
               elem.querySelector("th") &&
               String(elem.querySelector("th").innerText).match(reg) !== null
            ) {
               console.log("match! ", elem.innerText);
               elem.classList.remove("bpHide");
            } else {
               console.log("no match. moving on");
            }
         });

      [].slice.call(
            document.querySelector("table[id*='view_module']").querySelectorAll("tr.odd:not(.bpHide), tr.even:not(.bpHide)")
         ).forEach(function (elem) {
            if (elem.nextElementSibling !== null && elem.querySelector("th")) {
               var dataRow = elem.nextElementSibling;
               dataRow.classList.remove("bpHide");
               while (
                  dataRow.querySelector("td") &&
                  dataRow.nextElementSibling !== null &&
                  dataRow.nextElementSibling.querySelector("td")
               ) {
                  if (dataRow.nextElementSibling !== null) {
                     dataRow = dataRow.nextElementSibling;
                  }
                  console.log("dataRow is", dataRow);
                  dataRow.classList.remove("bpHide");
               }
            }
         });
   } else {
      console.log("unhiding");
      [].slice.call(document.querySelectorAll(".bpHide")).forEach(function (el) {
         el.classList.remove("bpHide");
      });
   }
}

// VIEW MODULE: Retest color: Colorize rows based on status message that was inserted
function retestColor() {
   $("td:has(pre) pre").add("td:has(span) span").each(function () {
      var thisTD = $(this);
      var thisHTML = thisTD.text();
      thisHTML = thisHTML.split("]")[0];
      if (thisHTML.indexOf("WIP") >= 0) {
         thisHTML = thisTD.text().split("]")[1];
      }
      var color = "";

      if (thisHTML.indexOf("NOT FIXED") >= 0) {
         color = "rgba(255, 249, 222, 1)";
      } else if (thisHTML.indexOf("FIXED") >= 0) {
         color = "rgba(0, 255, 0, 0.1)";
      } else if (thisHTML.indexOf("NOT RETESTED") >= 0) {
         color = "rgba(255,0,0,0.1)";
      } else if (thisHTML.indexOf("NEW") >= 0) {
         color = "#eee";
      }

      if (color) {
         thisTD.closest("tr").attr(
               "style",
               "background-color: " + color + " !important; border-bottom: 1px solid #ccc;"
            );
      }

      if (
         thisTD.text().split("]")[0].indexOf("WIP") >= 0
      ) {
         var number = thisTD.closest("tr").children("td").length;
         thisTD.closest("tr").before(
               '<tr><td colspan="' + number + '" style="background-color: #800000; color: #ffffff; text-align: center; font-weight: bold;">Work In Progress</td></th>'
            );
      }
   });
}

// VIEW MODULE: Edit Pattern button
function editPattern() {
   $("a[onclick^='modal_edit_pattern']").each(function () {
      var EditPattern = $(this);
      var PatternOnClick = EditPattern.attr("onclick");
      var PatternID = PatternOnClick.split(", ")[1];
      var anchor = document.createElement("a");
      var iconSpan = document.createElement("span");
      var iconTitle = "Go to Pattern " + PatternID;

      iconSpan.className = "fas fa-external-link-alt fa-w-16 medium";
      anchor.appendChild(iconSpan);
      anchor.href = "/public/reporting/view_pattern.php?pattern_id=" + PatternID;
      anchor.className = "button kpmGoToPattern";
      anchor.setAttribute("aria-label", iconTitle);
      anchor.title = iconTitle;
      EditPattern.before(anchor);
   });
}

// VIEW MODULE: Add links to the "Vew Module" page above the table
function viewModuleAddInstance() {
   var li = document.createElement("li");
   var anchor = '<a href="#" class="bulk_actions" onclick="modal_create_instances(this); return false;" title="Add Instances, Opens Dialog" accesskey="a"><i class="fas fa-plus-square"></i> Add Instance</a>';
   li.innerHTML = anchor;
   return li;
}

// VIEW MODULE: Add link to Add Pattern on the modules page
function viewModuleAddPattern() {
   var li = document.createElement("li");
   var anchor = '<a href="#" class="bulk_actions" onclick="modal_create_pattern(this); return false;" title="Add Pattern, Opens Dialog" accesskey="p"><i class="far fa-copy"></i> Add Pattern</a>';
   li.innerHTML = anchor;
   return li;
}

// VIEW MODULE: Add a preference checkbox to the top of the module page to add the colors or not
function addRetestChekbox() {
   var addCheckboxDIV = document.createElement("li");
   addCheckboxDIV.setAttribute(
      "style",
      "display: inline; float: right; margin-right: 1em;"
   );
   addCheckboxDIV.appendChild(
      buildCheckbox(
         "retestColor",
         "Colorize Rows for Retests",
         "Colorizes the cells that have a retest [DATE: FIXED] in them"
      )
   );
   return addCheckboxDIV;
}

// VIEW MOUDLE: Add Mark Complete button to "View Module" tabs
function viewModuleMark(moduleID) {
   var newTab = document.createElement("li");
   var newLink = document.createElement("a");
   var newLinkText = document.createTextNode("Mark Complete");

   newTab.setAttribute("role", "presentation");
   newLink.appendChild(newLinkText);
   newLink.title = "Mark Complete - Link to Test Module";
   newLink.href = "/public/audit/test_module_alternate.php?module_id=" + moduleID;

   newTab.appendChild(newLink);
   return newTab;
}

/* Add Instance (Modal) Specific Functions */

// ADD INSTANCE: Function for creating the dropdowns.
function createList2(array, name, id) {
   var output = '<li><a href="#" aria-haspopup="true">' + name + ' <span class="fas fa-angle-down"></span></a><ul class="dropdown" aria-label="submenu ' + id + '">';
   var i = 0;
   for (i = 0; i < array.length; i++) {
      var li = "<li>";
      if (array[i].div) {
         output += "<li class='divider'>" + array[i].div + "</li>";
      }
      output += li + '<a href="#" id=\'' + array[i].id + "'>" + array[i].text + "</a></li>";
   }
   output += "</ul></li>";
   return output;
}

// ADD INSTANCE: Function for building the rename fields
function renameFields(value) {
   var desc = document.createElement("p");
   var descText = document.createTextNode(value);
   desc.className = "kpmSmall";
   desc.appendChild(descText);
   return desc;
}

// ADD INSTANCE: NEW Function for creating the data list on the Add Instance Modal
function bestPracticeList2(element) {

   // Get all the currently displayed best practices and turn them into an array
   var bpList = new Array();
   var category;
   $(element).each(function () {
      var myOpt = $(this);
      var myOptValue = myOpt.attr("value");
      var myOptText = myOpt.text().trim();
      if (myOptValue != "" && myOptValue > "0") {
         bpList.push({
            'Value': myOptValue,
            'Text': myOptText,
            'Category': category
         });
      } else {
         category = myOptText;
      }
   });

   // Create the option list based on the different versions: Compact or regular.
   var newList = new Array();
   var newCategory;
   $.each(bpList, function() {
      var myText;
      if (!getCookieValue("kpmPref-bpListCompact")) {
         if (this.Category && newCategory != this.Category) {
            var catOption = document.createElement("option");
            var catText = document.createTextNode(this.Category);
            catOption.appendChild(catText);
            newList.push(catOption);
            newCategory = this.Category;
         }
         //myText = document.createTextNode("* " + this.Text);
          myText = "* " + this.Text;
      }
      else {
         //myText = document.createTextNode();
         myText = this.Category + ": " + this.Text;
      }
      var newOption = document.createElement("option");
      // newOption.appendChild(myText);
      newOption.value = myText;
      newOption.setAttribute('data-value',this.Value);
      newOption.setAttribute("data-text",this.Text.trim());
      newOption.title = this.Category;
      newList.push(newOption);
   });
   return newList;
}

// ADD INSTANCE: DEPRECIATED Function for creating the data list on the Add Instance Modal
/* function bestPracticeList(element) {
   // Get the list of all the existing best practices
   var bpList = new Array();
   var category;
   $(element).each(function () {
      if (getCookieValue("kpmPref-bpListCompact")) {
         var myOpt = $(this);
         var myOptValue = myOpt.attr("value");
         var myOptText = myOpt.text();
         if (myOptValue != "" && myOptValue > "0") {
            myOptText = myOptText + " **" + myOptValue;
         }
         var myText = document.createTextNode(myOptText);
         var newOption = document.createElement("option");
         newOption.appendChild(myText);
         bpList.push(newOption);
      } else {
         var myOpt = $(this);
         var myOptValue = myOpt.attr("value");
         var myOptText = myOpt.text().trim();
         var newOption = document.createElement("option");
         if (myOptValue != "" && myOptValue > "0") {
            myOptText = category + ": " + myOptText + " **" + myOptValue;
            var myText = document.createTextNode(myOptText);
            newOption.appendChild(myText);
            bpList.push(newOption);
         } else {
            category = myOptText;
         }
      }
   });
   return bpList;
}*/

// ADD INSTANCE: Hides the 'unused' fields that were added in Feb 2019
function hideUnusedFields() {
   $("textarea[id*='1_description']").add("textarea[id*='description_']").closest("tr").hide();
   $("textarea[id*='1_content_identifier']").add("textarea[id*='content_identifier_']").closest("tr").hide();
   $("textarea[id*='1_user_impact']").add("textarea[id*='user_impact_']").closest("tr").hide();
   $("textarea[id*='1_steps_to_reproduce']").add("textarea[id*='steps_to_reproduce_']").closest("tr").hide();
   $("textarea[id*='1_remediation']").add("textarea[id*='remediation_']").closest("tr").hide();
   $("textarea[id*='1_code_suggestion']").add("textarea[id*='code_suggestion_']").closest("tr").hide();
}

// ADD INSTANCE: Hides the instances 2-6 on the add instance modal
function hideAdditionalInstances() {
   $("textarea[id*='2_']").add("input[id*='2_']").add("select[id*='2_']").add("select[id*='severity_override_']:not(:first)").closest("tr").hide();
   $("textarea[id*='3_']").add("input[id*='3_']").add("select[id*='3_']").closest("tr").hide();
   $("textarea[id*='4_']").add("input[id*='4_']").add("select[id*='4_']").closest("tr").hide();
   $("textarea[id*='5_']").add("input[id*='5_']").add("select[id*='5_']").closest("tr").hide();
   $("textarea[id*='6_']").add("input[id*='6_']").add("select[id*='6_']").closest("tr").hide();
   $("textarea[id*='6_']").add("input[id*='6_']").add("select[id*='6_']").closest("tr").hide();
   $("legend:contains('Upload Image'):not(:first)").parent().closest("tr").hide();
   $("select[id*='severity_override_']:not(:first)").closest("tr").hide();
}

// Add Instance - Creates the dropdown buttons
function createAddInstanceButtons(response,status,reading,template) {
   var createButtons = "";
   createButtons += "<br><input type='button' id='ChgBPNow' value='Change Best Practice' class='kpmFirstButton'>&nbsp;<input type='button' id='GoToBP' value='Open BP (New Window)' class='kpmFirstButton'><br>";
   createButtons += '<nav id="kpmNav"><ul>';
   createButtons += createList2(template, "Templates", "checkTemplate");
   createButtons += createList2(response, "Responses", "checkResponce");
   createButtons += createList2(status, "Status/Pattern", "checkFlag");
   createButtons += createList2(reading,"Reading/Code","checkRecomended");
   createButtons += '<li><a href="#" id="clearFields">Clear Fields</a></li>';
   createButtons += "</ul></nav><br>";
   return createButtons
}

/* These are the containers of functions that are called below dynamically using mutation observers or delays */

// This looks at the view modules page.
function viewModules() {
   $("td:contains('http')").each(function () {
      var thisTD = $(this);
      var thisURL = thisTD.html();
      thisTD.html("<a href=\"" + thisURL + "\" target=\"_blank\">" + thisURL + "<span class=\"accessibleAltText\"> (Opens in New Window)</span></a>");
   });

   // TODO: Make this a function since I also do this for the instance page
   if (!getCookieValue("kpmPref-thumbALT")) {
      viewDivAltText()
   };
}

// This looks at the View All Instances list page.
function viewInstance() {

   //TODO: Find all these and turn them into a single function
   if (!getCookieValue("kpmPref-tableWarning")) {
      $("td:not(:has(div.checkbox-wrapper)) span").each(function () {
         var thisTD = $(this);
         var alert = injectWarning(thisTD);
         if (alert) {
            thisTD.prepend(alert);
         }
      });
   }
   if (!getCookieValue("kpmPref-retestColor")) {
      retestColor();
   }
   if (!getCookieValue("kpmPref-thumbALT")) {
      viewDivAltText()
   };
}

// This is the function for the Add Instance module.
function addEditor(reportID) {
   if ($("#amp_modal_reportModal").length !== 0 && $("#AmpOpts").length === 0 && window.location.href.indexOf("view_use_cases.php") <= -1) {

      // Create the new best practice lists
      $("select[id*='violation_']:first").before("<label for='ampOptsInpt'>Find a Best Practice: </label><br><input id='ampOptsInpt' list='AmpOpts' autocomplete='off'><datalist id='AmpOpts'></datalist><br>");
      $("#AmpOpts").append(bestPracticeList2("select[id*='violation_']:first option"));

      var instanceID = $("#instance_id-").attr("value");
      $("#modal_dialog_message_reportModal_title").append(": ID#" + instanceID);

      if (instanceID) {
         // $("#ajax_submit").attr("onclick","document.getElementById(" + instanceID + ").focus()");
         $("#ajax_submit").click(function(){
            setTimeOut($('#' + instanceID).focus(),1000);
        });

      }



      // Place the buttons
      $("#AmpOpts").after(createAddInstanceButtons(dataResponse(),dataStatus(),dataReading(),dataTemplate()));

      // Changes the best practice
      $("#ChgBPNow").on("click", function () {
         var inputValue = $("#ampOptsInpt").val().trim();
         var newBP = $("#AmpOpts option[value=\"" + inputValue + "\"]").attr("data-value");
         console.log(inputValue + " * " + newBP);
         $("select[id*='violation_']:first").val(newBP);
         var BPValue = 0;
         $("select[id*='severity_']:first").val(BPValue).val();
      });

      // Button to add "Go to best practice"
      $("#GoToBP").on("click", function () {
         var inputValue = $("#ampOptsInpt").val().trim();
         var newBP = $("#AmpOpts option[value=\"" + inputValue + "\"]").attr("data-value");
         if (!newBP) {
            newBP = $("select[id*='violation_']:first").val();
         }
         if (newBP && newBP > 0) {
            var newBPURL = "/public/standards/view_best_practice.php?violation_id=" + newBP + "&report_id=" + reportID;
            window.open(newBPURL, "_blank");
         } else {
            alert("No Best Practice Selected");
         }
      });

      // One single use statuses - Clear everything
      
      $("#clearFields").on("click", function () {
         $("textarea[id*='element']:first").val("");
         $("textarea[id*='attribute']:first").add("textarea[id*='note']:first").val("");
      });

      // When a response is given, this fills in the fields.
      $("[id*='response-']").click(function () {
         var clickID = $(this).attr("id");
         var response = dataResponse();
         var entry = response.find(function (e) {
            return e.id === clickID;
         });
         var newVar1;
         var newVar2;
         if (entry) {
            newVar1 = entry.var1;
            newVar2 = entry.var2;
            if (entry.keepOrig1) {
               newVar1 += $("textarea[id*='element']:first").val();
            }
            if (entry.keepOrig2) {
               newVar2 += $("textarea[id*='attribute']:first").add("textarea[id*='note']:first").val();
            }
         }
         if (newVar1) {
            $("textarea[id*='element']:first").val(newVar1);
         }
         if (newVar2) {
            $("textarea[id*='attribute']:first").add("textarea[id*='note']:first").val(newVar2);
         }
      });

      // When a response is given, this fills in the fields.
      $("[id*='template-']").click(function () {
         var clickID = $(this).attr("id");
         var template = dataTemplate();
         var entry = template.find(function (e) {
            return e.id === clickID;
         });
         var newVar1;
         var newVar2;
         if (entry) {
            newVar1 = entry.var1;
            newVar2 = entry.var2;
            if (entry.keepOrig1) {
               newVar1 += $("textarea[id*='element']:first").val();
            }
            if (entry.keepOrig2) {
               newVar2 += $("textarea[id*='attribute']:first").add("textarea[id*='note']:first").val();
            }
         }
         if (newVar1) {
            $("textarea[id*='element']:first").val(newVar1);
         }
         if (newVar2) {
            $("textarea[id*='attribute']:first").add("textarea[id*='note']:first").val(newVar2);
         }
      });

      // When a status is given, this prepends the first field
      $("[id*='status-']").click(function () {
         var clickID = $(this).attr("id");
         var status = dataStatus();
         var entry = status.find(function (e) {
            return e.id === clickID;
         });
         var text = "";
         if (clickID.indexOf("status-wcag") >= 0) {
            var level = clickID.split("-")[2].toUpperCase();
            text = "[WCAG Level: " + level + "]\n\n" + $("textarea[id*='element']:first").val();
         } else if (entry.date == "name") {
            var name = $("#userinfo ul li:first").text();
            var newText = entry.text.split("-")[0].trim();
            text = "[" + newText.toUpperCase() + " -" + name + "]\n\n" + $("textarea[id*='element']:first").val();
         } else if (entry.date == "no") {
            text = "[" + entry.text.toUpperCase() + "]\n\n" + $("textarea[id*='element']:first").val();
         } else {
            var $today = new Date();
            var dd = $today.getDate();
            var mm = $today.getMonth() + 1;
            var yyyy = $today.getFullYear();
            $today = mm + "/" + dd + "/" + yyyy;
            text = "[" + $today + ": " + entry.text.toUpperCase() + "]\n\n--------------------------\n\n" + $("textarea[id*='element']:first").val();
         }
         if (entry.text) {
            $("textarea[id*='element']:first").val(text);
         }
         if (entry.var1) {
            $("select[id*='defect_status_']:first").val(entry.var1);
         }
      });

      // When a reading is given, this appends the second field
      $("[id*='reading-']").click(function () {
         var clickID = $(this).attr("id");
         var reading = dataReading();
         var entry = reading.find(function (e) {
            return e.id === clickID;
         });
         var text = $("textarea[id*='attribute']:first").add("textarea[id*='note']:first").val() + entry.var1;
         if (entry.var1) {
            $("textarea[id*='attribute']:first").add("textarea[id*='note']:first").val(text);
         }
      });

      // When a special is given, this appends the second field
      $("[id*='special-']").click(function () {
         var clickID = $(this).attr("id");
         var status = dataStatus();
         var entry = status.find(function (e) {
            return e.id === clickID;
         });

         if (entry.var1 && entry.loc == "1") {
            var text = "[" + entry.var1 + "]\n\n" + $("textarea[id*='element']:first").val();
            $("textarea[id*='element']:first").val(text);
            } else if (entry.var1) {
            var text2 = "[" + entry.var1 + "]\n\n" + "textarea[id*='attribute']:first".add("textarea[id*='note']:first").val();
            $("textarea[id*='attribute']:first").add("textarea[id*='note']:first").val(text2);
            }
      });

      // Extras: Bottom of first field
      $("[id*='extras-']").click(function () {
         var clickID = $(this).attr("id");
         var status = dataStatus();
         var entry = status.find(function (e) {
            return e.id === clickID;
         });
         var text = $("textarea[id*='element']:first").val();
         text += "\n\n[" + entry.var1 + "]\n";
         $("textarea[id*='element']:first").val(text);
      });

      // Pattern: Add Pattern and Name if Available to the top of the First field.
      $("#code-pattern").click(function () {
         var pattern = "";
         var patternID = "name_" + $("#pattern_id-").attr("value");
         var patternName = $("#" + patternID).val();
         if (!patternName) {
            patternName = $("h3:contains(Pattern Members)").text().split("-").slice(1).join("-");
         }
         if (patternName) {
            pattern = patternName;
         }
         var text = "[Pattern: " + pattern + "]\n\n";
         text += $("textarea[id*='element']:first").val();
         // if (!getCookieValue("kpmPref-addOccurances")) { text += "\n\n[Occurrences]\n"; }
         $("textarea[id*='element']:first").val(text);
      });

      // Special Use Case: Add Module Number and Instance ID to the Second Field
      $("#code-modIns").click(function () {
         var FirstDigit = "XX";
         var SecondDigit = "XXX";
         var ModID = $(document).attr("title");
         ModID = ModID.substr(0, ModID.indexOf(" ")).replace(/\D/g, "");
         if (ModID) {
            FirstDigit = ModID;
         }
         var InstID = "";
         InstID = $("#instance_id-").attr("value");
         if (InstID) {
            SecondDigit = InstID.slice(-3);
         }
         var text = "[" + FirstDigit + " / " + SecondDigit + "]\n\n";
         text += $("textarea[id*='attribute']:first").add("textarea[id*='note']:first").val();
         $("textarea[id*='attribute']:first").add("textarea[id*='note']:first").val(text);
      });

      // Injects the alert on the textareas: TODO: make this dynamic on change.
      if (!getCookieValue("kpmPref-addWarning")) {
         $("textarea").each(function () {
            var thisTA = $(this);
            var alert = injectWarning(thisTA);
            if (alert) {
               thisTA.before(alert);
            }
         });
      }

      // Miscellanious items for the add instance modal
      // Resize the text areas
      $("textarea[id*='element']:first").attr("rows", "12");
      $("textarea[id*='attribute']:first").attr("rows", "12");
      $("textarea[id*='note']:first").attr("rows", "12");

      $("textarea[id*='element']:first").attr("cols", "75");
      $("textarea[id*='attribute']:first").attr("cols", "75");
      $("textarea[id*='note']:first").attr("cols", "75");

      // Put a note on the fields indicating their previous name. Related to the fields that were added in February 2019. This code should be removed at some point
      $("label[for*='element']").after(renameFields("Was: Description"));
      $("label[for*='attribute']").after(renameFields("Was: Note"));
      $("label[id*='element']").after(renameFields("Was: Note"));

      // This section is to hide input fields 2-6 on ADD only.
      if (!getCookieValue("kpmPref-showOne")) {
         hideAdditionalInstances();
      }

      // This section is to hide the fields that were added in February 2019. This code should be removed at some point
      if (!getCookieValue("kpmPref-hideNew")) {
         hideUnusedFields();
      }
   }
}

/* This is what injects into the page */
(function () {
   "use strict";
   console.log("Kevin's function loaded on AMP");
   var target = document.body;
   var reportID = getID(location.href, "report_id");
   var moduleID = getID(location.href, "module_id");
   var instanceID = getID(location.href, "instance_id");

   // If running from an external link, check to see if it is already running by looking for something that is always on.
   if (document.getElementById("kpmScriptRunning") != null) {
      alert("AMP script is already running");
   }
   // Client mode - Don't do any add stuff and hide a few things.
   else if (getCookieValue("kpmPref-clientMode") && getCookieValue("kpmPref-clientMode") == reportID) {
      // Toggle report view to SIMPLE
      if ( document.querySelector("#toggle-report-view") && !document.querySelector("#toggle-report-view").checked) {
         document.getElementById("toggle-report-view").click();
      }

      // Place the testing mode button in the side so that users can get back
      $("#container nav ul").append('<li tabindex="-1"><a href="#" id="kpmPref-clientMode"><span class="fas fa-laptop-code"></span>Testing Mode</a></li>');

      // Hide function
      clientHide();

      // Misc functions to clean up items after things have been removed
      var vmColspan = $('table[id*="view_module"] th[colspan]:first').attr(
         "colspan"
      );
      $('table[id*="view_module"] th[colspan]').attr(
         "colspan",
         parseInt(vmColspan, 10) - 2
      );
      $("#view_patterns_container thead th:not([width])").attr(
         "style",
         "width: 100%;"
      );

      // For the things I can't directly control, modify with CSS
      var cssArrayClient = {
         // General CSS
         "table.large, .view_patterns_container": "width: 100% !important;",
         "td.select-checkbox, th.select-checkbox, td.actions, th.actions, #view_use_cases_container table thead tr th:first-of-type, #view_use_cases_container table tbody tr td:first-of-type": "display: none;"
      };
      $("head").append(buildCSS(cssArrayClient));
   }
   // Testing Mode - Normal view for Level Access Testers
   else {

      // Add CSS to head
      $("head").append(buildCSS(dataCSS()));

      // Add button for client mode
      $("#container nav ul").append('<li tabindex="-1"><a href="#" id="kpmPref-clientMode" title="Simulates the client\'s view for delivery calls"><span class="fas fa-laptop-code"></span>Client Mode</a></li>');

      // EXPERIMENTAL - Get the table of patterns from the patterns page
      if (
         window.location.href.indexOf("/view_module.php?module_id=") >= 0 &&
         !getCookieValue("kpmPref-addPatterns")
      ) {
         var table = ajaxCall(
            "/public/reporting/view_globals_and_patterns.php?report_id=" + reportID,
            "#view_patterns_container table"
         );
         $("#MODULE_TAB_CONFIRMED-content").append(
            "<h3>Existing Patterns</h3><table>" + table + "</table>"
         );
         /*
                            var contentarray = [];
                            $(table).find('.odd,.even').each(function(){
                                var ThisIt = $(this);
                                contentarray.push(ThisIt.html());
                            });
                  */
         //          var newList = "<ul>";
         /*          $(contentarray).each(function() {
                                var thisRow = $(this);
                                var thisLink = $("td",thisRow).val();
                                alert(thisLink);
                                // newList += "<li>" + thisRow + "</li>";
                            }); */
         //         newList += "</ul>";
         //        $("#MODULE_TAB_CONFIRMED-content").before(newList);
      }

      // Builds the preferences box for the bottom of the page.
      if ( reportID !== null && $("#content") && !getCookieValue("kpmPref-hidePrefs")) {
         $("#content").append(preferencesBox());
      }
      else {
         $("#content").append(
            buildCheckbox("hidePrefs","Show AMP Script Preferences","Shows Kevin's AMP script preferences box")
         );
      }

      // DASHBOARD (view_report.php)
      if (window.location.href.indexOf("/view_report.php") >= 0) {
         // ALWAYS ON: if Dashboard, checkbox for full description
         $(".description:first h3").prepend(buildCheckbox("fullDescription","Show Full Desciption","Makes the description box show all the content","kpmDescPref"));
      }

      // VIEW MODULE (view_module.php)
      if (window.location.href.indexOf("/view_module.php?module_id=") >= 0) {
         // ALWAYS ON: This adds links/tabs/access keys to the View Module page.
         $("#menu_table_toolbar_actions").append(viewModuleAddInstance());
         $("#menu_table_toolbar_actions").append(viewModuleAddPattern());
         $("#menu_table_toolbar_actions").append(addRetestChekbox());
         $("a[onclick*='modal_edit_report_instances']").attr("accesskey", "z");
         $("a[onclick*='modal_delete_report_instances']").attr("accesskey", "x");
         $("ul[class='a11y-tabs-list']").append(viewModuleMark(moduleID));
         // ALWAYS ON: This makes the thumbnails retain their shape rather than being forced into a square
         $("table[id*='view_module'] img").attr("height", "auto");

         // FROM ALEX - FILTER FOR BP
         if (!getCookieValue("kpmPref-instanceFilter")) {
            $("#page_form").before(filterBP());
         }

         // Makes the ALT text visible for images. Doesn't work on the modal list as those are DIVs with background images
         if (!getCookieValue("kpmPref-thumbALT")) {
            viewAltText();
         }

         // Baseline Checkbox
         if (!getCookieValue("kpmPref-showBaseline")) {
            $(".view-module-container:first").prepend(baseLine(moduleID));
         }

         // For each patern in the list, creates a link button so that you can navigate there quickly
         if (!getCookieValue("kpmPref-addPatternLink")) {
            editPattern();
         }

         // Figure out if there is a status on this and apply a color.
         if (!getCookieValue("kpmPref-retestColor")) {
            retestColor();
         }

         // Inject the warning if any of the conditions are true (for the lists)
         // TODO: Create a single function for this
         if (!getCookieValue("kpmPref-tableWarning")) {
            $("td:not(:has(div.checkbox-wrapper))").each(function () {
               var thisTD = $(this);
               var alert = injectWarning(thisTD);
               if (alert) {
                  thisTD.prepend(alert);
               }
            });
         }

      }

      // TEST MODULE (test_module_alternate.php)
      if (window.location.href.indexOf("test_module_alternate.php") >= 0) {

         // ALWAYS ON: Makes the test module open with the review tab (mark complete) by default rather than an empty page.
         $("body").attr("onload","javascript:instHandler.showModule(); return false;");

         // ALWAYS ON: Adds the links to the top of the page for mark complete and edit module.
         $("#menu_table_toolbar_actions").append(testModuleLinks(moduleID));
      }

      // VIEW PATTERN (view_pattern.php)
      if (window.location.href.indexOf("/view_pattern.php") >= 0) {
         // ALWAYS ON: Adds accesskey to the patterns side rather than the module details side.
         $("a[onclick*='modal_create_pattern_violation']").attr("accesskey", "a");
         $("a[onclick*='modal_delete_pattern_violations']").attr("accesskey", "x");
      }

      // VIEW GLOBALS AND PATTERNS (view_globals_and_patterns.php)
// why does this always fire fhe first event.

      if (window.location.href.indexOf("/view_globals_and_patterns.php") >= 0) {
         if($('#view_patterns_container').size() !== 0){
  /*          setTimeout(function() {
              if ( $("a:contains('Name')").attr("title") == "Name - Sort Descending ") {
                  $("a:contains('Name')").trigger('click');
                  setTimeout(function() {
                     $("a:contains('Name')").trigger('click');
                     console.log("Double Click");
                  },500);
               }
               else
               if ($("a:contains('Name')").attr("title") == "Name - Descending - Sort Ascending ") {
                  $("a:contains('Name')").trigger('click');
                  console.log("Single Click");
               }
             },2000);*/



//            setTimeout(function(){
 //               jQuery('tr.pagination a').eq(0).trigger('click');
  //          },2000);
        }
      }

      // ADD INSTANCE (add_instance.php) - This is the window that appears if you mess up a submission from the modal
      // TODO: this doesn't fully work. Look into it
      if (window.location.href.indexOf("/add_instance.php") >= 0) {
         addEditor(reportID);
      }

      // GLOBAL ELEMENTS
      // GLOBAL ALWAYS ON: Adds the links to the header IF there is a report id (this way they don't appear on the best practices, etc.).
      if (reportID) {
         $("#secondary-header").append(mainNav(reportID, moduleID));
      }

      // GLOBAL ALWAYS ON: Add options to number of items shown in the Violations Lists
      $("#instances_length select").prepend('<option value="5">5</option><option value="10">10</option>');
      $("#instances_length select option[value='2000']").before('<option value="500">500</option><option value="1000">1000</option>');

      // GLOBAL: Any time there is a best practice modal link, create buttons to the page best practice and the copy best pratice
      if (!getCookieValue("kpmPref-addBPLink")) {
         bestPracticeLinks();
      }

      // GLOBAL: Hide Global Patterns
      if (!getCookieValue("kpmPref-globals")) {
         // Hides Globals from edit patern
         if (window.location.href.indexOf("/view_globals_and_patterns.php") >= 0) {
            $("h2:contains('Globals')").hide();
            $("#view_globals_container").hide();
            $("#view_globals_container").after('<p class="kpmSmall">Globals hidden by Kevin\'s AMP Script. You can make them show again in the preferences below.</p>');
         }
         $("a[onclick^='modal_create_global']").hide();
      }

      // The following should be done with mutationObersvers, but I can't figure it out right now. So for now, they are on delay.
      // VIEW MODULES (view_modules.php)
      if (window.location.href.indexOf("/view_modules.php") >= 0) {
         setTimeout(function () {
            viewModules();
         }, 1500);
      }

      if (window.location.href.indexOf("/view_instances.php") >= 0) {
         setTimeout(function () {
            viewInstance();
         }, 3000);
      }

      // The following are tools for functionality, not functionality itself, so there is no preference for turning on/off.
      // Pramaters for the mutation obsercers
      var config = {
         attributes: true,
         childList: true,
         characterData: true,
         subtree: true
      };

      // Add Editor
      if ($("#amp_modal_reportModal").length === 0) {
         // set up the mutation observer for the view modules page
         var addObserver = new MutationObserver(function (mutations, me) {
            var addModal = document.getElementById('modal_form');
            if (addModal) {
               addEditor(reportID);
               me.disconnect(); // stop observing
               return;
            }
         });
         addObserver.observe(target, config);
      }

      /************************************************

      These mutation observers don't work because the table is loaded but then modified.
      I need to figure out how to look to see when the table is FINISHED loading, otherwise I can only get the first row.

      ************************************************/

      /*
          // Look for the modules table (view_modules page)
          var newTarget = document.querySelector("#modules_info")
          var configText  = { childList: true };
          if(window.location.href.indexOf("view_modules.php") >= 0) {
               // set up the mutation observer for the view modules page
               var modulesObserver = new MutationObserver(function (mutations, me) {
                  var moduleTable = document.querySelector("#modules_info");
                  if (moduleTable == 'childList') {
                     testMe($("#modules"));
                     me.disconnect(); // stop observing
                     return;
                  }
               });

               modulesObserver.observe(newTarget,configText);
            }

            // Look for the modules table (view_modules page)
            if(window.location.href.indexOf("view_instances.php") >= 0) {
               // set up the mutation observer for the view patterns page
               var instanceObserver = new MutationObserver(function (mutations, me) {
                  var instanceTable = document.getElementById('instances_wrapper').querySelectorAll("table");
                  if (instanceTable) {
                     console.log("View Instances Table");
                     viewInstance(instanceTable);
                     me.disconnect(); // stop observing
                     return;
                  }
               });
               instanceObserver.observe(target,config);
            }
      */

   }

   // Function to set the cookie if click on a checkbox happened. All the way at the bottom of the script to make sure that it catches everything
   $("[id*='kpmPref-']").add("[id*='kpmChecklist-']").click(function () {
         var clickID = $(this).attr("id");
         var cbCookie = getCookieValue(clickID);

         if (cbCookie) { Cookies.set(clickID, "", -1);}
         else if (clickID == "kpmPref-clientMode") { Cookies.set(clickID, reportID); }
         else if (clickID.indexOf("kpmChecklist-") !== -1) { Cookies.set(clickID, reportID, { expires: 60 }); }
         else { Cookies.set(clickID, reportID, { expires: 7 }); }
         location.reload();
      });
})();