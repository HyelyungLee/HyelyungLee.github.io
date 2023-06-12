
(function($) {

	var	$window = $(window),
		$body = $('body'),
		$sidebar = $('#sidebar');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ null,      '480px'  ]
		});

	// Hack: Enable IE flexbox workarounds.
		if (browser.name == 'ie')
			$body.addClass('is-ie');

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Forms.

		// Hack: Activate non-input submits.
			$('form').on('click', '.submit', function(event) {

				// Stop propagation, default.
					event.stopPropagation();
					event.preventDefault();

				// Submit form.
					$(this).parents('form').submit();

			});

	// Sidebar.
		if ($sidebar.length > 0) {

			var $sidebar_a = $sidebar.find('a');

			$sidebar_a
				.addClass('scrolly')
				.on('click', function() {

					var $this = $(this);

					// External link? Bail.
						if ($this.attr('href').charAt(0) != '#')
							return;

					// Deactivate all links.
						$sidebar_a.removeClass('active');

					// Activate link *and* lock it (so Scrollex doesn't try to activate other links as we're scrolling to this one's section).
						$this
							.addClass('active')
							.addClass('active-locked');

				})
				.each(function() {

					var	$this = $(this),
						id = $this.attr('href'),
						$section = $(id);

					// No section for this link? Bail.
						if ($section.length < 1)
							return;

					// Scrollex.
						$section.scrollex({
							mode: 'middle',
							top: '-20vh',
							bottom: '-20vh',
							initialize: function() {

								// Deactivate section.
									$section.addClass('inactive');

							},
							enter: function() {

								// Activate section.
									$section.removeClass('inactive');

								// No locked links? Deactivate all links and activate this section's one.
									if ($sidebar_a.filter('.active-locked').length == 0) {

										$sidebar_a.removeClass('active');
										$this.addClass('active');

									}

								// Otherwise, if this section's link is the one that's locked, unlock it.
									else if ($this.hasClass('active-locked'))
										$this.removeClass('active-locked');

							}
						});

				});

		}

	// Scrolly.
		$('.scrolly').scrolly({
			speed: 1000,
			offset: function() {

				// If <=large, >small, and sidebar is present, use its height as the offset.
					if (breakpoints.active('<=large')
					&&	!breakpoints.active('<=small')
					&&	$sidebar.length > 0)
						return $sidebar.height();

				return 0;

			}
		});

	// Spotlights.
		$('.spotlights > section')
			.scrollex({
				mode: 'middle',
				top: '-10vh',
				bottom: '-10vh',
				initialize: function() {

					// Deactivate section.
						$(this).addClass('inactive');

				},
				enter: function() {

					// Activate section.
						$(this).removeClass('inactive');

				}
			})
			.each(function() {

				var	$this = $(this),
					$image = $this.find('.image'),
					$img = $image.find('img'),
					x;

				// Assign image.
					$image.css('background-image', 'url(' + $img.attr('src') + ')');

				// Set background position.
					if (x = $img.data('position'))
						$image.css('background-position', x);

				// Hide <img>.
					$img.hide();

			});

	// Features.
		$('.features')
			.scrollex({
				mode: 'middle',
				top: '-20vh',
				bottom: '-20vh',
				initialize: function() {

					// Deactivate section.
						$(this).addClass('inactive');

				},
				enter: function() {

					// Activate section.
						$(this).removeClass('inactive');

				}
			});

	})(jQuery);

	// Food 버튼 함수
	// 삼원가든 정보
	const koreanfoodIf01 = () => {
		window.open('https://map.naver.com/v5/entry/place/11718583?lng=127.03254904071&lat=37.524675120004&placePath=%2Fhome&entry=plt&c=15,0,0,0,dh');
	};
	// 삼원가든 메뉴판
	const koreanfoodMenu01 = () => {
		window.open('https://sgdinehill.co.kr/samwon-garden/menu/');
	};

	// 네모집 한남 정보
	const koreanfoodIf02 = () => {
		window.open('https://map.naver.com/v5/entry/place/1245523036?lng=127.01012407044693&lat=37.534755516555144&placePath=%2Fhome&entry=plt');
	};
	// 네모집 한남 메뉴판
	const koreanfoodMenu02 = () => {
		window.open('https://www.nemocp.co.kr/_files/ugd/40f575_237d59b8660f4a87ab67aa237ec42a3e.pdf');
	};

	// 정이담 정보
	const koreanfoodIf03 = () => {
		window.open('https://map.naver.com/v5/search/%EC%A0%95%EC%9D%B4%EB%8B%B4/place/1738855814?placePath=%3Fentry%253Dpll&c=15,0,0,0,dh');
	};
	// 정이담 메뉴판
	const koreanfoodMenu03 = () => {
		window.open('https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230512_278%2F1683817900550vAQxn_JPEG%2F%25BB%25E7%25C1%25F8%25B8%25DE%25B4%25BA%25C6%25C7.jpg');
	};
	
	// 스시기요세 정보
	const japanesefoodIf = () => {
		window.open('https://map.naver.com/v5/entry/place/567265782?lng=127.036652299471&lat=37.52394620003069&placePath=%2Fhome&entry=plt');
	};
	// 스시기요세 메뉴판
	const japanesefoodMenu = () => {
		window.open('https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230131_149%2F1675169168052Mzk9F_JPEG%2FKakaoTalk_20230131_214432035.jpg');
	};

	// 수린한남 정보
	const koreanfoodIf04 = () => {
		window.open('https://map.naver.com/v5/entry/place/1403932874?lng=127.004443418702&lat=37.5365992300861&placePath=%2Fhome&entry=plt');
	};
	// 수린한남 메뉴판
	const koreanfoodMenu04 = () => {
		window.open('https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230315_255%2F1678855764092BNUpI_JPEG%2F9FBFD1B1-B3F1-4BD7-AF60-673FF28FE63B.jpeg');
	};

	// 아틀리에폰드 정보
	const dessertIf01 = () => {
		window.open('https://map.naver.com/v5/entry/place/1952494114?lng=127.00343388939827&lat=37.537672817620056&placePath=%2Fhome&entry=plt');
	};
	// 아틀리에폰드 메뉴판
	const dessertMenu01 = () => {
		window.open('https://www.instagram.com/patisserie.pond/?igshid=Mzc1MmZhNjY%3D');
	};

	// 아우프글렛 정보
	const dessertIf02 = () => {
		window.open('https://map.naver.com/v5/search/%EC%95%84%EC%9A%B0%ED%94%84%EA%B8%80%EB%A0%9B/place/1416109994?placePath=%3Fentry=pll%26from=nx%26fromNxList=true&c=15,0,0,0,dh');
	};
	// 아우프글렛 메뉴판
	const dessertMenu02 = () => {
		window.open('https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20210308_155%2F1615178090409dpPPo_JPEG%2FMPa-H_RT3_KlnTdOa33qBlJ5.jpeg.jpg');
	};
	// 카페온화 정보
	const dessertIf03 = () => {
		window.open('https://map.naver.com/v5/search/%EC%84%B1%EC%88%98%20%EC%B9%B4%ED%8E%98%EC%98%A8%ED%99%94/place/1321493330?placePath=%3Fentry=pll%26from=nx%26fromNxList=true&c=15,0,0,0,dh');
	};
	// 카페온화 메뉴판
	const dessertMenu03 = () => {
		window.open('https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20190730_261%2F1564465435830jBlrf_JPEG%2FQWcToPMETfdq5VFqJEJtUE3E.jpg');
	};


	// 게임
	const popup = () => {
		const width = 530;
		const height = 530;
		const left = (screen.width - width) / 2 + screen.availLeft;
		const top = (screen.height - height) / 2 + screen.availTop;
		console.log(width, height, left, top);
	
		open("popup.html", "popup", `width=${width}px, height=${height}px, left=${left}px, top=${top}px`);
	}

	const profile = () => {
		const width = 370;
		const height = 525;
		const left = (screen.width - width) / 2 + screen.availLeft;
		const top = (screen.height - height) / 2 + screen.availTop;
		console.log(width, height, left, top);
	
		open("profile.html", "popup", `width=${width}px, height=${height}px, left=${left}px, top=${top}px`);
	}


	// 공통

	// 스크롤
	// id값 지정, 0.5초에 걸쳐 이동
	scrollTop('button', 500);

	function scrollTop(elem,duration) {
		let target = document.getElementById(elem);
		
		// target에 이벤트 함수 추가 (클릭시 이동)
		target.addEventListener('click', function() {

			// 현재 스크롤 위치
			let currentY = window.pageYOffset; 
			// 애니메이션 스크롤의 이동 단계 크기 결정 (값이 1보다 크다면 10, 그렇지 않으면 100)
			let step = duration/currentY > 1 ? 10 : 100;
			// 스크롤 단계 사이의 시간 간격 설정
			let timeStep = duration/currentY * step;
			// 스크롤 애니메이션 제어
			let intervalID = setInterval(scrollUp, timeStep);

			// 스크롤 애니메이션 단계 처리 함수
			function scrollUp(){
				// 페이지 맨 위 도달
				currentY = window.pageYOffset;
				if(currentY === 0) {
					// 애니메이션 멈춤
					clearInterval(intervalID);
				} else {
					// scrollBy (수평 스크롤 위치, 수직 스크롤 위치)
					// -step = 스크롤 위로 이동
					scrollBy( 0, -step );
				}
			}
		});
	}





