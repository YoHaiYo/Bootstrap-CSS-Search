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

function formatCSSRule(rule, mediaQuery) {
  // const selector = rule.selectorText ? `<span class="selector">${rule.selectorText}</span> <span class="inner_bracket">{</span><br/>` : '';  

  let selector = '';
  

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
  
  let mediaTag = mediaQuery ? `<div class="media">@media <span class="media_range">${mediaQuery}</span></div> {<br>` : '';
  // let openMedia = mediaQuery ? "{" : "";
  let closeMedia = mediaQuery ? `<span class="inner_bracket"><br>}</span>` : "";

  /// 미디어쿼리있을때 없을때 괄호색 다르게
  if (rule.selectorText) {
    selector = `<span class="selector">${rule.selectorText}</span> <span >{</span><br/>`;
    if (mediaTag) {
      selector = `<span class="selector">${rule.selectorText}</span> <span class="inner_bracket">{</span><br/>`;
    } 
  } else {
    selector = "";
  }

  return `<div class="css-rule">${mediaTag}
  ${selector}${formattedProperties}
  ${closeMedia}
  ${closingBrace}
  </div>`;
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
function recommendClass(v) {
  document.getElementById('classSearch').value = v;
}

function searchClass() {
  var input = document.getElementById('classSearch').value.toLowerCase();
  var stylesheets = document.styleSheets;
  var result = '';

  let hasResults = false; // 결과가 있는지 확인하는 플래그

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
        var mediaQuery = '';

        if (rule instanceof CSSMediaRule) {
          mediaQuery = rule.conditionText;
          for (var k = 0; k < rule.cssRules.length; k++) {
            var innerRule = rule.cssRules[k];
            if (innerRule.selectorText && innerRule.selectorText.toLowerCase().includes(input)) {
              result += formatCSSRule(innerRule, mediaQuery);
              hasResults = true;
            }
          }
        } else if (rule.selectorText && rule.selectorText.toLowerCase().includes(input)) {
          result += formatCSSRule(rule);
          hasResults = true;
        }
      }
    }
  }

  // 결과가 없으면 메시지 표시
  if (!hasResults) {
    result = 'No results found.';
  }

  document.getElementById('result').innerHTML = result;
}

window.onload = function() {
  document.getElementById('result').innerHTML = getAllCSS();
};