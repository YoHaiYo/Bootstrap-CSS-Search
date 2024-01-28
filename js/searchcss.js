// 부트스트랩 버전 선택
let bootstrapver = "Bootstrap_v5.3.2"; // 첫 선택 버전

// 이벤트 리스너 추가
document.querySelectorAll('.verbtns').forEach(function(btn) {
  btn.addEventListener('click', function() {
    // 모든 버튼의 on_version 클래스를 제거
    document.querySelectorAll('.verbtns').forEach(function(btn) {
      btn.classList.remove('on_version');
    });

    // 클릭된 버튼에 on_version 클래스 추가
    btn.classList.add('on_version');

    document.querySelector("#selectver").textContent = btn.value;
    bootstrapver = btn.value; // 선택한 버전을 설정
    searchClass(); // 클래스 검색 다시 수행
  });
});

/// css 검색
function formatCSSValue(value) {
  let colorPreview = '';
  
  // Check if the value is a color code
  const isColorCode = /^#([0-9A-Fa-f]{3}){1,2}$/.test(value.trim());
  
  if (isColorCode) {
      colorPreview = `<div class="color-preview" style="background-color: ${value.trim()}"></div>`;
  }
  
  return value.replace(/(\w+-*\w+)\(([^)]+)\)/g, '<span class="function-name">$1</span>(<span class="function-arg">$2</span>)') + colorPreview;
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

  let hasResults = false; // Add a flag to check if there are any results

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
          hasResults = true; // Set the flag to true if there are results
        }
      }
    }
  }

  // Check if there are no results and display a message
  if (!hasResults) {
    result = 'No results found.';
  }

  document.getElementById('result').innerHTML = result;
}


window.onload = function() {
  document.getElementById('result').innerHTML = getAllCSS();
};