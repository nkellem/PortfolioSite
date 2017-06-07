"use strict";

var currentPage;
var pages = ["#rambot", "#characterContent", "#asteroidContent", "#saloonContent", "#portraitContent", "#HVZContent", "#quadContent"];
//all the methods being run once the page loads
//all lgihtbox code found here

$(document).ready(function()
{
	ProjectOverlays();
	MobileNavToggle();
	SmoothScroll();
	
	var imageGallery = document.querySelectorAll(".lightbox");
	
	//$(function()
	//{
		//$(".scroll").on("click", function(e)
		//{
			//e.preventDefault();
			//ScrollToElement(e.target.classList[2]);
		//});
	//});
	
	if($(window).width() > "480")
	{
		var galleryCounter = 0;

		$(".lightbox").on("click", function(e)
		{
			
			var lightbox = document.createElement("DIV");
			lightbox.style.position = "fixed";
			lightbox.style.height = "100%";
			lightbox.style.width = "100%";
			lightbox.style.left = 0;
			lightbox.style.top = 0;
			lightbox.style.backgroundColor = "rgba(0,0,0,0.7)";
			lightbox.style.display = "none";
			lightbox.style.zIndex = 1000;

			var myImg = document.createElement("IMG");
			galleryCounter = parseInt(e.target.classList[2]);
			myImg.src = imageGallery[galleryCounter].src;
			
			var exitBox = document.createElement("DIV");
			var exitText = document.createElement("DIV");
			var leftBox = document.createElement("DIV");
			var leftArrow = document.createElement("DIV");
			var rightBox = document.createElement("DIV");
			var rightArrow = document.createElement("DIV");
			
			exitBox.style.color = "white";
			exitBox.style.cursor = "pointer";
			exitBox.style.position = "absolute";
			exitBox.style.fontSize = "3em";
			exitBox.style.fontFamily = "Quicksand";
			exitBox.style.width = "65px";
			exitBox.style.backgroundColor = "rgba(0,0,0,0.5)";
			exitBox.style.textAlign = "center";
			
			exitText.innerHTML = "x";
			
			leftBox.style.textAlign = "center";
			leftBox.style.color = "white";
			leftBox.style.cursor = "pointer";
			leftBox.style.position = "absolute";
			leftBox.style.fontSize = "3em";
			leftBox.style.fontFamily = "Quicksand";
			leftBox.style.backgroundColor = "rgba(0,0,0,0.5)";
			leftBox.style.width = "65px";
			
			leftArrow.innerHTML = "<";
			//leftArrow.style.height = "50px";
			
			rightBox.style.textAlign = "center";
			rightBox.style.color = "white";
			rightBox.style.cursor = "pointer";
			rightBox.style.position = "absolute";
			rightBox.style.fontSize = "3em";
			rightBox.style.fontFamily = "Quicksand";
			rightBox.style.backgroundColor = "rgba(0,0,0,0.5)";
			rightBox.style.width = "65px";
			
			rightArrow.innerHTML = ">";

			myImg.onload = function()
			{
				myImg.style.position = "absolute";
				myImg.style.width = Math.round($(window).width() * 0.75) + "px";
				myImg.style.height = Math.round($(myImg).width() * 0.56) + "px";
				
				var diffWidth = $(window).width()/2 - $(myImg).width()/2;
				var diffHeight = $(window).height()/2 - $(myImg).height()/2;
				var newHeight = diffHeight + 10;
				var leftBoxLeft = diffWidth - 65;
				var rightBoxLeft = diffWidth + $(myImg).width();
				
				leftBox.style.height = $(myImg).height() + "px";
				rightBox.style.height = $(myImg).height() + "px";

				myImg.style.left = diffWidth + "px";
				myImg.style.top = diffHeight + "px";
				exitBox.style.left = leftBoxLeft + "px";
				leftBox.style.top = diffHeight + "px";
				leftBox.style.left = leftBoxLeft + "px";
				rightBox.style.top = diffHeight + "px";
				rightBox.style.left = rightBoxLeft + "px";

				lightbox.appendChild(myImg);
				leftBox.appendChild(leftArrow);                
				rightBox.appendChild(rightArrow);
				
				if(imageGallery.length > 1)
				{
					lightbox.appendChild(leftBox);
					lightbox.appendChild(rightBox);
				}
				
				exitBox.appendChild(exitText);
				lightbox.appendChild(exitBox);
				
				document.body.appendChild(lightbox);
				$(lightbox).fadeIn(200);
                var leftArrowMargin = $(leftBox).height()/2 - $(leftArrow).height()/2;
				leftArrow.style.marginTop = leftArrowMargin + "px";
                var rightArrowMargin = $(rightBox).height()/2 - $(rightArrow).height()/2;
				rightArrow.style.marginTop = rightArrowMargin + "px";
                var exitHeight = diffHeight - $(exitBox).innerHeight();
				exitBox.style.top = exitHeight + "px";

				$(leftArrow).css('user-select', 'none');
				$(leftArrow).css('-o-user-select', 'none');
				$(leftArrow).css('moz-user-select', 'none');
				$(leftArrow).css('-khtml-user-select', 'none');
				$(leftArrow).css('-webkit-user-select', 'none');

				$(rightArrow).css('user-select', 'none');
				$(rightArrow).css('-o-user-select', 'none');
				$(rightArrow).css('moz-user-select', 'none');
				$(rightArrow).css('-khtml-user-select', 'none');
				$(rightArrow).css('-webkit-user-select', 'none');

				$(exitText).css('user-select', 'none');
				$(exitText).css('-o-user-select', 'none');
				$(exitText).css('moz-user-select', 'none');
				$(exitText).css('-khtml-user-select', 'none');
				$(exitText).css('-webkit-user-select', 'none');

				$(myImg).css('user-select', 'none');
				$(myImg).css('-o-user-select', 'none');
				$(myImg).css('moz-user-select', 'none');
				$(myImg).css('-khtml-user-select', 'none');
				$(myImg).css('-webkit-user-select', 'none');
			};
			
            
			lightbox.addEventListener("click", function(e)
			{
				if(e.target != leftBox && e.target != rightBox && e.target != myImg && e.target != rightArrow && e.target != leftArrow)
				{
					$(lightbox).fadeOut(200, function(){
						lightbox.remove();
					});
				}
			});

			exitBox.addEventListener("click", function(e)
			{
				$(lightbox).fadeOut(200, function(){
					lightbox.remove();
				});
			});
			
			leftBox.addEventListener("click", function(e)
			{
				galleryCounter -= 1;
				if(galleryCounter < 0)
				{
					galleryCounter = imageGallery.length - 1;
				}
				myImg.src = imageGallery[galleryCounter].src;
			});
			
			rightBox.addEventListener("click", function(e)
			{
				galleryCounter += 1;
				if(galleryCounter >= imageGallery.length)
				{
					galleryCounter = 0;
				}
				
				myImg.src = imageGallery[galleryCounter].src;
			});
			
			$(exitBox).hover(function()
			{
				exitBox.style.transition = "background-color 0.3s";
				exitBox.style.backgroundColor = "rgba(75,75,75, 0.7)";
			},
			function()
			{
				exitBox.style.backgroundColor = "rgba(0,0,0,0.7)";
			});
			
			$(leftBox).hover(function()
			{
				leftBox.style.transition = "background-color 0.3s";
				leftBox.style.backgroundColor = "rgba(75,75,75, 0.7)";
			},
			function()
			{
				leftBox.style.backgroundColor = "rgba(0,0,0,0.7)";
			});
			
			$(rightBox).hover(function()
			{
				rightBox.style.transition = "background-color 0.3s";
				rightBox.style.backgroundColor = "rgba(75,75,75, 0.7)";
			},
			function()
			{
				rightBox.style.backgroundColor = "rgba(0,0,0,0.7)";
			});
		});
	}
});

function ProjectOverlays()
{
	if($(window).width() > "480")
	{
		var caption;
	
		$(".transition").hover(function()
		{
		
			var id = this.id;
			caption = document.createElement("a");
		
			switch(id)
			{
				case "rightT": 
					caption.innerHTML = $("#rightT").find("h2.caption").text();
					break;
				
				case "middleT":
					caption.innerHTML = $("#middleT").find("h2.caption").text();
					break;
				
				case "leftT":
					caption.innerHTML = $("#leftT").find("h2.caption").text();
					break;
				
				case "rightB":
					caption.innerHTML = $("#rightB").find("h2.caption").text();
					break;
				
				case "middleB":
					caption.innerHTML = $("#middleB").find("h2.caption").text();
					break;
				
				case "leftB":
					caption.innerHTML = $("#leftB").find("h2.caption").text();
					break;
			
				default:
					break;
			}
		
			id = "#" + id;
			$(caption).hide().appendTo(id).fadeIn(500);
			caption.style.color = "White";
			caption.style.fontSize = "2.5em";
			caption.style.fontFamily = 'Oswald';
			caption.style.height = "100%";
			caption.style.width = "100%";
			caption.style.top = 0;
			caption.style.left = 0;
			caption.style.paddingTop = ($(id).height()/2 - $(caption).innerHeight()/2) + "px";
			caption.style.position = "absolute";
			caption.style.backgroundColor = "rgba(0,0,0,0.5)";
			caption.style.textDecoration = "none";
			caption.href = $(id).find("a").attr('href');
		},
		function()
		{
			$(caption).fadeOut(500, function()
			{
				$(this).remove();
			});
		});
	}
}

function MobileNavToggle()
{
	var navShowing = false;

	$("#hamIcon").on("click", function()
	{
		if(!navShowing)
		{
			$("#navigation").slideDown(250);
			$("#hamIcon").css("borderColor", "#44685E");
			$("#hamIconInner").css("borderColor", "#44685E");
			navShowing = true;
		}
		else
		{
			$("#navigation").slideUp(250);
			$("#hamIcon").css("borderColor", "white");
			$("#hamIconInner").css("borderColor", "white");
			navShowing = false;
		}
	});

	$(window).resize(function()
	{
		if($(window).width() > '600')
		{
			$('#navigation').css('display', 'block');
		}
		else if($(window).width() < '600' || $(window).width() == 'NaN')
		{
			//$('#navigation').css('display', 'none');
		}
	});
}

function SmoothScroll()
{
	$(".scroll").on('click', function(e)
	{
		if(this.hash !== "")
		{
			e.preventDefault();

			var id = this.hash;
			var target = $(id).offset().top;

			if(id == "#one")
			{
				target -= 85;
			}

			$('html, body').animate(
			{
				scrollTop: target
			}, 800, function()
			{
				window.location.hash = id;
			});
		}
	});
}