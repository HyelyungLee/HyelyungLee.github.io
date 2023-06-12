(function($) {

	/**
	 * Generate an indented list of links from a nav. Meant for use with panel().
	 * @return {jQuery} jQuery object.
	 */
	$.fn.navList = function() {

		var	$this = $(this);
			$a = $this.find('a'),
			b = [];

		$a.each(function() {

			var	$this = $(this),
				indent = Math.max(0, $this.parents('li').length - 1),
				href = $this.attr('href'),
				target = $this.attr('target');

			b.push(
				'<a ' +
					'class="link depth-' + indent + '"' +
					( (typeof target !== 'undefined' && target != '') ? ' target="' + target + '"' : '') +
					( (typeof href !== 'undefined' && href != '') ? ' href="' + href + '"' : '') +
				'>' +
					'<span class="indent-' + indent + '"></span>' +
					$this.text() +
				'</a>'
			);

		});

		return b.join('');

	};

	/**
	 * Panel-ify an element.
	 * @param {object} userConfig User config.
	 * @return {jQuery} jQuery object.
	 */
	$.fn.panel = function(userConfig) {

		// No elements?
			if (this.length == 0)
				return $this;

		// Multiple elements?
			if (this.length > 1) {

				for (var i=0; i < this.length; i++)
					$(this[i]).panel(userConfig);

				return $this;

			}

		// Vars.
			var	$this = $(this),
				$body = $('body'),
				$window = $(window),
				id = $this.attr('id'),
				config;

		// Config.
			config = $.extend({

				// Delay.
					delay: 0,

				// Hide panel on link click.
					hideOnClick: false,

				// Hide panel on escape keypress.
					hideOnEscape: false,

				// Hide panel on swipe.
					hideOnSwipe: false,

				// Reset scroll position on hide.
					resetScroll: false,

				// Reset forms on hide.
					resetForms: false,

				// Side of viewport the panel will appear.
					side: null,

				// Target element for "class".
					target: $this,

				// Class to toggle.
					visibleClass: 'visible'

			}, userConfig);

			// Expand "target" if it's not a jQuery object already.
				if (typeof config.target != 'jQuery')
					config.target = $(config.target);

		// Panel.

			// Methods.
				$this._hide = function(event) {

					// Already hidden? Bail.
						if (!config.target.hasClass(config.visibleClass))
							return;

					// If an event was provided, cancel it.
						if (event) {

							event.preventDefault();
							event.stopPropagation();

						}

					// Hide.
						config.target.removeClass(config.visibleClass);

					// Post-hide stuff.
						window.setTimeout(function() {

							// Reset scroll position.
								if (config.resetScroll)
									$this.scrollTop(0);

							// Reset forms.
								if (config.resetForms)
									$this.find('form').each(function() {
										this.reset();
									});

						}, config.delay);

				};

			// Vendor fixes.
				$this
					.css('-ms-overflow-style', '-ms-autohiding-scrollbar')
					.css('-webkit-overflow-scrolling', 'touch');

			// Hide on click.
				if (config.hideOnClick) {

					$this.find('a')
						.css('-webkit-tap-highlight-color', 'rgba(0,0,0,0)');

					$this
						.on('click', 'a', function(event) {

							var $a = $(this),
								href = $a.attr('href'),
								target = $a.attr('target');

							if (!href || href == '#' || href == '' || href == '#' + id)
								return;

							// Cancel original event.
								event.preventDefault();
								event.stopPropagation();

							// Hide panel.
								$this._hide();

							// Redirect to href.
								window.setTimeout(function() {

									if (target == '_blank')
										window.open(href);
									else
										window.location.href = href;

								}, config.delay + 10);

						});

				}

			// Event: Touch stuff.
				$this.on('touchstart', function(event) {

					$this.touchPosX = event.originalEvent.touches[0].pageX;
					$this.touchPosY = event.originalEvent.touches[0].pageY;

				})

				$this.on('touchmove', function(event) {

					if ($this.touchPosX === null
					||	$this.touchPosY === null)
						return;

					var	diffX = $this.touchPosX - event.originalEvent.touches[0].pageX,
						diffY = $this.touchPosY - event.originalEvent.touches[0].pageY,
						th = $this.outerHeight(),
						ts = ($this.get(0).scrollHeight - $this.scrollTop());

					// Hide on swipe?
						if (config.hideOnSwipe) {

							var result = false,
								boundary = 20,
								delta = 50;

							switch (config.side) {

								case 'left':
									result = (diffY < boundary && diffY > (-1 * boundary)) && (diffX > delta);
									break;

								case 'right':
									result = (diffY < boundary && diffY > (-1 * boundary)) && (diffX < (-1 * delta));
									break;

								case 'top':
									result = (diffX < boundary && diffX > (-1 * boundary)) && (diffY > delta);
									break;

								case 'bottom':
									result = (diffX < boundary && diffX > (-1 * boundary)) && (diffY < (-1 * delta));
									break;

								default:
									break;

							}

							if (result) {

								$this.touchPosX = null;
								$this.touchPosY = null;
								$this._hide();

								return false;

							}

						}

					// Prevent vertical scrolling past the top or bottom.
						if (($this.scrollTop() < 0 && diffY < 0)
						|| (ts > (th - 2) && ts < (th + 2) && diffY > 0)) {

							event.preventDefault();
							event.stopPropagation();

						}

				});

			// Event: Prevent certain events inside the panel from bubbling.
				$this.on('click touchend touchstart touchmove', function(event) {
					event.stopPropagation();
				});

			// Event: Hide panel if a child anchor tag pointing to its ID is clicked.
				$this.on('click', 'a[href="#' + id + '"]', function(event) {

					event.preventDefault();
					event.stopPropagation();

					config.target.removeClass(config.visibleClass);

				});

		// Body.

			// Event: Hide panel on body click/tap.
				$body.on('click touchend', function(event) {
					$this._hide(event);
				});

			// Event: Toggle.
				$body.on('click', 'a[href="#' + id + '"]', function(event) {

					event.preventDefault();
					event.stopPropagation();

					config.target.toggleClass(config.visibleClass);

				});

		// Window.

			// Event: Hide on ESC.
				if (config.hideOnEscape)
					$window.on('keydown', function(event) {

						if (event.keyCode == 27)
							$this._hide(event);

					});

		return $this;

	};

	/**
	 * Apply "placeholder" attribute polyfill to one or more forms.
	 * @return {jQuery} jQuery object.
	 */
	$.fn.placeholder = function() {

		// Browser natively supports placeholders? Bail.
			if (typeof (document.createElement('input')).placeholder != 'undefined')
				return $(this);

		// No elements?
			if (this.length == 0)
				return $this;

		// Multiple elements?
			if (this.length > 1) {

				for (var i=0; i < this.length; i++)
					$(this[i]).placeholder();

				return $this;

			}

		// Vars.
			var $this = $(this);

		// Text, TextArea.
			$this.find('input[type=text],textarea')
				.each(function() {

					var i = $(this);

					if (i.val() == ''
					||  i.val() == i.attr('placeholder'))
						i
							.addClass('polyfill-placeholder')
							.val(i.attr('placeholder'));

				})
				.on('blur', function() {

					var i = $(this);

					if (i.attr('name').match(/-polyfill-field$/))
						return;

					if (i.val() == '')
						i
							.addClass('polyfill-placeholder')
							.val(i.attr('placeholder'));

				})
				.on('focus', function() {

					var i = $(this);

					if (i.attr('name').match(/-polyfill-field$/))
						return;

					if (i.val() == i.attr('placeholder'))
						i
							.removeClass('polyfill-placeholder')
							.val('');

				});

		// Password.
			$this.find('input[type=password]')
				.each(function() {

					var i = $(this);
					var x = $(
								$('<div>')
									.append(i.clone())
									.remove()
									.html()
									.replace(/type="password"/i, 'type="text"')
									.replace(/type=password/i, 'type=text')
					);

					if (i.attr('id') != '')
						x.attr('id', i.attr('id') + '-polyfill-field');

					if (i.attr('name') != '')
						x.attr('name', i.attr('name') + '-polyfill-field');

					x.addClass('polyfill-placeholder')
						.val(x.attr('placeholder')).insertAfter(i);

					if (i.val() == '')
						i.hide();
					else
						x.hide();

					i
						.on('blur', function(event) {

							event.preventDefault();

							var x = i.parent().find('input[name=' + i.attr('name') + '-polyfill-field]');

							if (i.val() == '') {

								i.hide();
								x.show();

							}

						});

					x
						.on('focus', function(event) {

							event.preventDefault();

							var i = x.parent().find('input[name=' + x.attr('name').replace('-polyfill-field', '') + ']');

							x.hide();

							i
								.show()
								.focus();

						})
						.on('keypress', function(event) {

							event.preventDefault();
							x.val('');

						});

				});

		// Events.
			$this
				.on('submit', function() {

					$this.find('input[type=text],input[type=password],textarea')
						.each(function(event) {

							var i = $(this);

							if (i.attr('name').match(/-polyfill-field$/))
								i.attr('name', '');

							if (i.val() == i.attr('placeholder')) {

								i.removeClass('polyfill-placeholder');
								i.val('');

							}

						});

				})
				.on('reset', function(event) {

					event.preventDefault();

					$this.find('select')
						.val($('option:first').val());

					$this.find('input,textarea')
						.each(function() {

							var i = $(this),
								x;

							i.removeClass('polyfill-placeholder');

							switch (this.type) {

								case 'submit':
								case 'reset':
									break;

								case 'password':
									i.val(i.attr('defaultValue'));

									x = i.parent().find('input[name=' + i.attr('name') + '-polyfill-field]');

									if (i.val() == '') {
										i.hide();
										x.show();
									}
									else {
										i.show();
										x.hide();
									}

									break;

								case 'checkbox':
								case 'radio':
									i.attr('checked', i.attr('defaultValue'));
									break;

								case 'text':
								case 'textarea':
									i.val(i.attr('defaultValue'));

									if (i.val() == '') {
										i.addClass('polyfill-placeholder');
										i.val(i.attr('placeholder'));
									}

									break;

								default:
									i.val(i.attr('defaultValue'));
									break;

							}
						});

				});

		return $this;

	};

	/**
	 * Moves elements to/from the first positions of their respective parents.
	 * @param {jQuery} $elements Elements (or selector) to move.
	 * @param {bool} condition If true, moves elements to the top. Otherwise, moves elements back to their original locations.
	 */
	$.prioritize = function($elements, condition) {

		var key = '__prioritize';

		// Expand $elements if it's not already a jQuery object.
			if (typeof $elements != 'jQuery')
				$elements = $($elements);

		// Step through elements.
			$elements.each(function() {

				var	$e = $(this), $p,
					$parent = $e.parent();

				// No parent? Bail.
					if ($parent.length == 0)
						return;

				// Not moved? Move it.
					if (!$e.data(key)) {

						// Condition is false? Bail.
							if (!condition)
								return;

						// Get placeholder (which will serve as our point of reference for when this element needs to move back).
							$p = $e.prev();

							// Couldn't find anything? Means this element's already at the top, so bail.
								if ($p.length == 0)
									return;

						// Move element to top of parent.
							$e.prependTo($parent);

						// Mark element as moved.
							$e.data(key, $p);

					}

				// Moved already?
					else {

						// Condition is true? Bail.
							if (condition)
								return;

						$p = $e.data(key);

						// Move element back to its original location (using our placeholder).
							$e.insertAfter($p);

						// Unmark element as moved.
							$e.removeData(key);

					}

			});

	};

})(jQuery);

	// 첫 화면 타이핑

	// 변수 할당
	const content = "HyeroWorld!!";
	const text = document.querySelector(".text");

	// 변수 초기화
	let i = 0;

	// 한 글자씩 타이핑 하는 함수
	function typing(){
		// content변수에서 i인덱스에 해당하는 글자 가져오기
		let txt = content[i++];
		// text요소의 내용에 가져온 글자 추가
		text.innerHTML += txt;

		// 무한반복되는 타이핑 조건문
		if (i > content.length) {
			// text.textContent 빈 문자열로 설정 (타이핑 한 내용을 화면에서 지움)
			text.textContent = "";
			// i 변수를 0으로 초기화하면 다음번 타이핑 시작 시 content 문자열의 첫번째 글자부터 타이핑하도록 설정
			i = 0;
		}
	}
	// 4초마다 타이핑
	setInterval(typing, 400)
	

	// 회원가입 저장
	// 윈도우 실행시 바로 뜨는 코드 
	window.onload = () => {
		loadMember();
	};
	
  // 비밀번호/비밀번호 체크 일치여부 검사
  document.querySelector("#pwdCheck").onblur = isEqualPwd; 
	
  document.memberFrm.onsubmit = function () {
	  const userId = document.getElementById("userId");
	  const pwd = document.getElementById("pwd");
	  const pwdCheck = document.getElementById("pwdCheck");
	  const userName = document.getElementById("userName");
	  const email = document.getElementById("email");
	  const tel1 = document.getElementById("tel1");
	  const tel2 = document.getElementById("tel2");
	  const tel3 = document.getElementById("tel3");

	  //1.아이디검사
	  //첫글자는 반드시 영소문자로 이루어지고,
	  //아이디의 길이는 4~12글자사이
	  //숫자가 하나이상 포함되어야함.
	  const regExp1 = /^[a-z][a-z\d]{3,11}$/;
	  const regExp2 = /[0-9]/;
	  if(!regExpTest(regExp1
					,userId
					,"아이디는 영소문자로 시작하는 4~12글자입니다."))
		  return false; // submit핸들러 기본 작동(submit)을 방지
	  if(!regExpTest(regExp2
					,userId
					,"아이디는 숫자를 하나이상 포함하세요."))
		  return false;

	  //2.비밀번호 확인 검사
	  //숫자/문자/특수문자/ 포함 형태의 8~15자리 이내의 암호 정규식
	  //전체길이검사 /^.{8,15}$/
	  //숫자하나 반드시 포함 /\d/
	  //영문자 반드시 포함 /[a-zA-Z]/
	  //특수문자 반드시 포함  /[*!&@#$%~]/

	  const regExpArr = [/^.{8,15}$/, /\d/, /[a-zA-Z]/, /[*!&@#$%~]/];

	  for (let i = 0; i < regExpArr.length; i++) {
		if (
		  !regExpTest(
			regExpArr[i],
			pwd,
			"비밀번호는 8~15자리 숫자/문자/특수문자를 포함해야합니다."
		  )
		) {
		  return false;
		}
	  }

	  //비밀번호일치여부
	  if (!isEqualPwd()) {
		return false;
	  }

	  //3.이름검사
	  //한글2글자 이상만 허용.
	  const regExp3 = /^[가-힣]{2,}$/;
	  if (!regExpTest(regExp3, userName, "한글2글자이상 입력하세요."))
		return false;


	  //5.이메일 검사
	  // 4글자 이상(\w = [a-zA-Z0-9_], [\w-\.]) @가 나오고
	  // 1글자 이상(주소). 글자 가 1~3번 반복됨
	  if (
		!regExpTest(
		  /^[\w]{4,}@[\w]+(\.[\w]+){1,3}$/,
		  email,
		  "이메일 형식에 어긋납니다."
		)
	  )
		return false;

	  //6. 전화번호 검사
	  // 전화번호 앞자리는 두자리이상, 두번째 자리는 3~4자리 숫자, 세번째 자리는 4자리 숫자
		if (!regExpTest(/^0\d{1,2}$/, tel1, "번호 2자리 이상 입력")) 
			return false;
	  if (!regExpTest(/^[0-9]{3,4}$/, tel2, "번호 3자리 이상 입력"))
			return false;
	  if (!regExpTest(/^[0-9]{4}$/, tel3, "4자리 번호 입력"))
			return false;

		saveMember();
	  return true;

	};

	function isEqualPwd() {
	  if (pwd.value === pwdCheck.value) {
		return true;
	  } else {
		alert("비밀번호가 일치하지 않습니다.");
		pwd.select();
		return false;
	  }
	}

	function regExpTest(regExp, el, msg) {
	  if (regExp.test(el.value)) return true;
	  //적합한 문자열이 아닌 경우
	  alert(msg);
	  el.value = "";
	  el.focus();
	  return false;
	};

	const loadMember = () => {
		const tbody = document.querySelector("table#tbl-member tbody");
		const memberss = JSON.parse(localStorage.getItem('memberss'));

		tbody.innerHTML = memberss.reduce((html, {userId, pwd, userName, email, tel1, tel2, tel3}, index) => {
		const tr = `
		<tr>
			<td>${index + 1}</td>
			<td>${userId}</td>
			<td>${pwd}</td>
			<td>${userName}</td>
			<td>${email}</td>
			<td>${tel1+tel2+tel3}</td>
		</tr>
		`;
		console.log(memberss);
		console.log(email);
		console.log(userName);
		return html + tr;
		}, "")
	};

	// 로컬스트리지에 사용자입력값 저장
	const saveMember = () => {
		console.log('제출성공!');

		const frm = document.memberFrm;
		const userId = frm.userId;
		const pwd = frm.pwd;
		const userName = frm.userName;
		const email = frm.email;
		const tel1 = frm.tel1;
		const tel2 = frm.tel2;
		const tel3 = frm.tel3;

		const members = new Member(userId.value, pwd.value, userName.value, email.value, tel1.value, tel2.value, tel3.value);

		const memberss = JSON.parse(localStorage.getItem('memberss')) || [];

		memberss.push(members);
		const jsonStr = JSON.stringify(memberss);
		localStorage.setItem("memberss", jsonStr);

		// 초기화코드
		userId.value = '';
		pwd.value = '';
		pwdCheck.value = '';
		userName.value = '';
		email.value = '';
		tel1.value = '';
		tel2.value = '';
		tel3.value = '';

		// 테이블로 바꿔주는 함수 호출
		loadMember();
	};

	class Member {
		constructor (userId, pwd, userName, email, tel1, tel2, tel3){
			this.userId = userId;
			this.pwd = pwd;
			this.userName = userName;
			this.email = email;
			this.tel1 = tel1;
			this.tel2 = tel2;
			this.tel3 = tel3;
		}
		toString() {
			return `Member(userId=${userId}), pwd=${pwd}, userName=${userName}, email=${email}, tel1=${tel1}, tel2=${tel2}, tel3=${tel3}`;
		}
	};
	console.log(Member.toString());