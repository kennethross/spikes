if (things.mostActiveChannel) throw "MostActiveChannel already exists";

things.mostActiveChannel = function() {
  return {
    element: document.getElementById('most-active-channel'),
    present: function(data) {
      this.element.innerHTML = presentMostActive(data.payload);
    }
  };
}

function presentMostActive(data) {
  return '<div class="content-container active-image">' +
  '<div class="active-container">' +
    '<div class="active-filler"></div>' +
    '<span class="active-channel-header">' + '&#128172;' + '</span>' +
    '<br>' +
    '<div>' +
      '<span class="active-channel-copy"><b class="active-channel-name">#' + data.channel.name + '</b><i> is the most active channel</i></span>' +
    '</div>' +
  '</div>' +
'</div>';
}
