function copyToClipboard(text, key) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      $('button[data-key="' + key + '"]').html("✔️");
      setTimeout(function () {
        $('button[data-key="' + key + '"]').html("📋");
      }, 2500);
    })
    .catch(() => {
      //
    });
}

function renderData(dataArray) {
  let html = "";
  if (dataArray == null || dataArray.length < 1) {
    return false;
  }
  let x = 1;
  dataArray.reverse();
  dataArray = dataArray.slice(0, 15);
  dataArray.map(function (element) {
    if (element !== "") {
      html += '<div class="input-group">';
      html +=
        '<input type="text" class="form-control" placeholder="Key" readonly value="' +
        element +
        '" />';
      html += '<div class="input-group-btn">';
      html +=
        '<button class="btn btn-default" onclick="copyToClipboard(\'' +
        element +
        "', '" +
        x +
        '\')" data-key="' +
        x +
        '">';
      html += "📋";
      html += "</button>";
      html += "</div>";
      html += "</div>";
      x++;
    }
  });
  let loadMore = '<div class="clearfix"></div>';
  if (dataArray.length > 15) {
    loadMore +=
      '<a class="btn btn-warning btn-block" href="https://github.com/ircfspace/endpoint/blob/main/ip.json" dir="rtl" target="_blank">';
    loadMore += "مشاهده بیشتر";
    loadMore += "</a>";
  }
  $("#setContent").html(html + loadMore);
}

function getType() {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const type = params.get("type");
  return type ? type : "w4";
}

window.addEventListener("load", function () {
  const cachedData = localStorage.getItem("warpData");
  const cachedTime = localStorage.getItem("warpDataTime");
  if (
    cachedData !== "undefined" &&
    cachedTime !== "undefined" &&
    Date.now() - cachedTime < 15 * 60 * 1000
  ) {
    renderData(cachedData);
  } else {
    fetch("https://raw.githubusercontent.com/ircfspace/endpoint/main/v2.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (getType() === "w4" && data.warp.ipv4.length > 0) {
          renderData(data.warp.ipv4);
        } else if (getType() === "w6" && data.warp.ipv6.length > 0) {
          renderData(data.warp.ipv6);
        } else if (getType() === "m4" && data.masque.ipv4.length > 0) {
          renderData(data.masque.ipv4);
        } else if (getType() === "m6" && data.masque.ipv6.length > 0) {
          renderData(data.masque.ipv6);
        } else {
          renderData(cachedData);
        }
      })
      .catch((error) => {
        renderData(cachedData);
      });
  }

  let getIpType = getType();
  $("li[data-ip]").removeClass("active");
  $('li[data-ip="' + getIpType + '"]').addClass("active");
});
