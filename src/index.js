import './styles/base.scss';
console.log(`Base Js connected`);

// Semantic Cards JS
$('.special.cards .image').dimmer({
  on: 'hover'
});

$('.vendorDetailBtn').click(function() {
	// Show Modal
	console.log(`Click and open modal`);

	$('.ui.modal.vendorDetail')
	  .modal('show');
})

console.log('test');
