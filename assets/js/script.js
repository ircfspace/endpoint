function copyToClipboard(text, key) {
    navigator.clipboard.writeText(text).then(() => {
        $('button[data-key="'+key+'"]').html('✔️');
        setTimeout(function() {
            $('button[data-key="'+key+'"]').html('📋');
        }, 2500)
    }).catch(() => {
        //
    });
}

function renderData(dataArray) {
    let html = '';
    if (typeof dataArray === "undefined" || dataArray.length < 1) {
        return false;
    }
    let x = 1;
    dataArray.reverse();
    dataArray = dataArray.slice(0, 15);
    dataArray.map(function(element) {
        if ( element !== "" ) {
            html += '<div class="input-group">';
            html += '<input type="text" class="form-control" placeholder="Key" readonly value="'+element+'" />';
            html += '<div class="input-group-btn">';
            html += '<button class="btn btn-default" onclick="copyToClipboard(\'' + element + '\', \'' + x + '\')" data-key="'+x+'">';
            html += '📋';
            html += '</button>';
            html += '</div>';
            html += '</div>';
            x++;
        }
    });
    let loadMore = '<div class="clearfix"></div>';
    loadMore += '<a class="btn btn-warning btn-block" href="https://github.com/ircfspace/endpoint/blob/main/ip.json" dir="rtl" target="_blank">';
    loadMore += 'مشاهده بیشتر';
    loadMore += '</a>';
    $('#setContent').html(html+loadMore);
}

function getType() {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const type = params.get('type');
    return type ? type : 'ipv4';
}

window.addEventListener('load', function() {
    const cachedData = localStorage.getItem('warpData');
    const cachedTime = localStorage.getItem('warpDataTime');
    if (cachedData !== "undefined" && cachedTime !== "undefined" && (Date.now() - cachedTime < 15 * 60 * 1000)) {
        renderData(cachedData);
    } else {
        fetch('https://raw.githubusercontent.com/ircfspace/endpoint/main/ip.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (getType() === 'ipv4' && data.ipv4.length > 0) {
                    renderData(data.ipv4);
                }
                else if (getType() === 'ipv6' && data.ipv6.length > 0) {
                    renderData(data.ipv6);
                }
                else {
                    renderData(cachedData);
                }
            })
            .catch(error => {
                renderData(cachedData);
            });
    }

    let getIpType = getType();
    if ( getIpType === 'ipv4') {
        $('li[data-ip="v4"]').addClass('active');
        $('li[data-ip="v6"]').removeClass('active');
    }
    else if ( getIpType === 'ipv6') {
        $('li[data-ip="v6"]').addClass('active');
        $('li[data-ip="v4"]').removeClass('active');
    }
});
