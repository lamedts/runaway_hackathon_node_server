import './styles/main.scss';
import './js/uploadOrder.js';

console.log(`Base Js connected`);

// Semantic Sidebar Hover Cards JS
$('.special.cards .image').dimmer({
  on: 'hover'
});

// View Details and open modal
$('.vendorDetailBtn').click(function() {
	// Show Modal
	console.log(`Click and open modal`);

	$('.ui.modal.vendorDetail').modal('show');
})

// Select Vender and change button color and value from "Select" to "Selected"
$(".vendorSelectBtn").click(function() {
	var $anchor = $(this)
	if ($anchor.hasClass('orange')) {
		$anchor.removeClass('orange inverted').addClass('green').text('Selected');
	} else if ($anchor.hasClass('green')) {
		$anchor.removeClass('green').addClass('orange inverted').text('Select');
	} else {
		return
	}
})


