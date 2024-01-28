/// 부트스트랩 버전 선택
let bootstrapver = "Bootstrap_v5.3.2.css";

document.querySelector('#ver462').addEventListener('click', function(){
  bootstrapver = "Bootstrap_v4.6.2.css"
  searchClass()
  document.querySelector('#ver532').classList.remove("on_version")
  document.querySelector('#ver462').classList.add("on_version")
  document.querySelector("#selectver").innerHTML="ver.4.6.2"
 })
document.querySelector('#ver532').addEventListener('click', function(){
  bootstrapver = "Bootstrap_v5.3.2.css"
  searchClass()
  document.querySelector('#ver462').classList.remove("on_version")
  document.querySelector('#ver532').classList.add("on_version")
  document.querySelector("#selectver").innerHTML="ver.5.3.2"
 })


/// css 검색
function formatCSSValue(value) {
  return value.replace(/(\w+-*\w+)\(([^)]+)\)/g, '<span class="function-name">$1</span>(<span class="function-arg">$2</span>)');
}

function formatCSSRule(rule) {
  const selector = rule.selectorText ? `<span class="selector">${rule.selectorText}</span> {<br/>` : '';
  let properties = [];

  if (rule.style) {
      for (let property of rule.style) {
          if (rule.style.getPropertyValue(property)) {
              let value = formatCSSValue(rule.style.getPropertyValue(property).trim());
              properties.push(`&nbsp;&nbsp;<span class="property">${property}</span>: <span class="value">${value}</span>;`);
          }
      }
  }

  let formattedProperties = properties.join('<br/>');
  let closingBrace = properties.length > 0 ? `<br/>}` : '}';

  return `<div class="css-rule">${selector}${formattedProperties}${closingBrace}</div>`;
}

function processStylesheet(stylesheet) {
  var result = '';
  var rules;

  try {
      rules = stylesheet.rules || stylesheet.cssRules;
  } catch (e) {
      console.error("Cannot access rules of stylesheet: ", stylesheet.href);
      return '';
  }

  for (var j = 0; j < rules.length; j++) {
      result += formatCSSRule(rules[j]);
  }

  return result;
}

function getAllCSS() {
  var stylesheets = document.styleSheets;
  var allCSS = '';

  for (var i = 0; i < stylesheets.length; i++) {
      if (stylesheets[i].href && stylesheets[i].href.includes(bootstrapver)) {
          allCSS += processStylesheet(stylesheets[i]);
      }
  }

  return allCSS;
}

function searchClass() {
  var input = document.getElementById('classSearch').value.toLowerCase();
  var stylesheets = document.styleSheets;
  var result = '';

  for (var i = 0; i < stylesheets.length; i++) {
      if (stylesheets[i].href && stylesheets[i].href.includes(bootstrapver)) {
          var rules;
          try {
              rules = stylesheets[i].rules || stylesheets[i].cssRules;
          } catch (e) {
              console.error("Cannot access rules of stylesheet: ", stylesheets[i].href);
              continue;
          }

          for (var j = 0; j < rules.length; j++) {
              var rule = rules[j];
              if (rule.selectorText && rule.selectorText.toLowerCase().includes(input)) {
                  result += formatCSSRule(rule);
              }
          }
      }
  }

  document.getElementById('result').innerHTML = result ? result : getAllCSS();
}

window.onload = function() {
  document.getElementById('result').innerHTML = getAllCSS();
};