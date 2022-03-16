var Base64 = {
  // private property
  _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

  // public method for encoding
  encode : function (input) {
      var output = "";
      var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
      var i = 0;

      input = Base64._utf8_encode(input);

      while (i < input.length) {

          chr1 = input.charCodeAt(i++);
          chr2 = input.charCodeAt(i++);
          chr3 = input.charCodeAt(i++);

          enc1 = chr1 >> 2;
          enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
          enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
          enc4 = chr3 & 63;

          if (isNaN(chr2)) {
              enc3 = enc4 = 64;
          } else if (isNaN(chr3)) {
              enc4 = 64;
          }

          output = output +
          Base64._keyStr.charAt(enc1) + Base64._keyStr.charAt(enc2) +
          Base64._keyStr.charAt(enc3) + Base64._keyStr.charAt(enc4);
      }

      return output;
  },

  // public method for decoding
  decode : function (input) {
      var output = "";
      var chr1, chr2, chr3;
      var enc1, enc2, enc3, enc4;
      var i = 0;

      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

      while (i < input.length) {

          enc1 = Base64._keyStr.indexOf(input.charAt(i++));
          enc2 = Base64._keyStr.indexOf(input.charAt(i++));
          enc3 = Base64._keyStr.indexOf(input.charAt(i++));
          enc4 = Base64._keyStr.indexOf(input.charAt(i++));

          chr1 = (enc1 << 2) | (enc2 >> 4);
          chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
          chr3 = ((enc3 & 3) << 6) | enc4;

          output = output + String.fromCharCode(chr1);

          if (enc3 != 64) {
              output = output + String.fromCharCode(chr2);
          }
          if (enc4 != 64) {
              output = output + String.fromCharCode(chr3);
          }
      }

      output = Base64._utf8_decode(output);

      return output;
  },

  // private method for UTF-8 encoding
  _utf8_encode : function (string) {
      string = string.replace(/\r\n/g,"\n");
      var utftext = "";

      for (var n = 0; n < string.length; n++) {

          var c = string.charCodeAt(n);

          if (c < 128) {
              utftext += String.fromCharCode(c);
          }
          else if((c > 127) && (c < 2048)) {
              utftext += String.fromCharCode((c >> 6) | 192);
              utftext += String.fromCharCode((c & 63) | 128);
          }
          else {
              utftext += String.fromCharCode((c >> 12) | 224);
              utftext += String.fromCharCode(((c >> 6) & 63) | 128);
              utftext += String.fromCharCode((c & 63) | 128);
          }
      }
      return utftext;
  },

  // private method for UTF-8 decoding
  _utf8_decode : function (utftext) {
      var string = "";
      var i = 0;
      var c = c1 = c2 = 0;

      while ( i < utftext.length ) {

          c = utftext.charCodeAt(i);

          if (c < 128) {
              string += String.fromCharCode(c);
              i++;
          }
          else if((c > 191) && (c < 224)) {
              c2 = utftext.charCodeAt(i+1);
              string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
              i += 2;
          }
          else {
              c2 = utftext.charCodeAt(i+1);
              c3 = utftext.charCodeAt(i+2);
              string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
              i += 3;
          }
      }
      return string;
  }
}

function load(url){
  $(".ratio").empty();
  $(".ratio").append(
    `<iframe frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    src="${url}" allowfullscreen=""></iframe>`
  );
}

function loadlist(data){
  $('.video-content').removeClass('d-none');
  data = JSON.parse(Base64.decode(data));
  icon = ['<i class="fa-solid fa-file-image"></i>', '<i class="fa-solid fa-file-pdf"></i>', '<i class="fa-solid fa-circle-play"></i>', '<i class="fa-solid fa-circle-play"></i>'];
  $(".listvideo").empty();
  console.log(data);
  $(".listvideo").append(`<a class="btn d-none" type="button" "></a>`);
  for (e of data) {
    console.log(e.url);
    if(e.type == 3)
        $(".listvideo").append(
            `<a class="btn btn-outline-secondary text-left" type="button" href="#" onclick="load('https://video.vatlyhadong.com/streamer/embed.php?v=${e.url}')">
            ${icon[e.type]}
            ${e.title}
        </a>`
        );
    else
        $(".listvideo").append(
            `<a class="btn btn-outline-secondary text-left" type="button" href="#" onclick="load('https://drive.google.com/file/d/${e.url}/preview')">
            ${icon[e.type]}
            ${e.title}
        </a>`
        );
  }
  $(".listvideo").append(`<a class="btn d-none" type="button" "></a>`);
}

function tai_chuong(b64){
    data = JSON.parse(Base64.decode(b64));
    for(e of data){
        var list = '';
        for(elm of e.data){
            list += 
            `<a type="button" class="btn text-left" href="#" onclick="loadlist('${elm.data}')">
                ${elm.title}
            </a>`
        }
        var res =
        `<div class="accordion-item">
            <h2 class="accordion-header" id="${e.id}">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${e.id}-content" aria-expanded="false" aria-controls="${e.id}-content">
                ${e.title}
            </button>
            </h2>
            <div id="${e.id}-content" class="accordion-collapse collapse" aria-labelledby="${e.id}" data-bs-parent="#muc-luc">
            <div class="accordion-body">
                <div class="btn-group-vertical gap-2 w-100" role="group" aria-label="Vertical button group">
                <a type="button" class="btn d-none"></a>
                ${list}
                <a type="button" class="btn d-none"></a>
                </div>
            </div>
            </div>
        </div>`
        $('#muc-luc').append(res);
    }
}

$(document).ready(()=>{
    s = 
    [
    `WwogIHsKICAgICJpZCI6ImNodW9uZy00IiwKICAgICJ0aXRsZSI6IkNoxrDGoW5nIDQ6IFPDs25nIMSRaeG7h24gdOG7qyIsCiAgICAiZGF0YSI6WwogICAgICB7CiAgICAgICAgInRpdGxlIjoiQsOgaSAxOiBN4bqhY2ggZGFvIMSR4buZbmcgTEMiLAogICAgICAgICJkYXRhIjoiV3dvZ0lIc0tJQ0FnSUNKMGFYUnNaU0k2SUNKRHc2RmphQ0JvNGJ1Tll5QnVhT0c3cjI1bklHTm94ckRHb1c1bklHTjE0YnVSYVNJc0NpQWdJQ0FpZFhKc0lqb2dJakZJWkY5RFpWZGFkbU53VmpGUVpYZFJZbXBIZUV0RFUyVldiVWRGVHpjNU1TSXNDaUFnSUNBaWRIbHdaU0k2SUNJd0lnb2dJSDBzQ2lBZ2V3b2dJQ0FnSW5ScGRHeGxJam9nSWt6RHZTQjBhSFY1NGJxL2RDd2dZOE8wYm1jZ2RHamh1NmxqTENCanc2RmpJSGJEclNCazRidWxJR1BHb1NCaTRicWpiaUJ0NGJxaFkyZ2dURU1pTEFvZ0lDQWdJblZ5YkNJNklDSXhNemhEWDFCWlZVWkNVMUZ3VVhKd2IyTktSM3BxVGpaVVdsZ3hia1ZNTW1RaUxBb2dJQ0FnSW5SNWNHVWlPaUFpTWlJS0lDQjlMQW9nSUhzS0lDQWdJQ0owYVhSc1pTSTZJQ0pHYVd4bElNU1I0YnVCSWl3S0lDQWdJQ0oxY213aU9pQWlNVE10WDJoNFVVbHhWMFJITFdWTVNHcDFaVzh3V2xsR1ZqRmhlbFpHU201Q0lpd0tJQ0FnSUNKMGVYQmxJam9nSWpFaUNpQWdmU3dLSUNCN0NpQWdJQ0FpZEdsMGJHVWlPaUFpVm1sa1pXOGdaMm5odXFOcElHTm9hU0IwYWVHNnYzUWlMQW9nSUNBZ0luVnliQ0k2SUNJeE0xUnJTRGhUVDNCUFJFOHRjUzFXZFRSbVJETlpWVGhvYjJseVRuWlRUVklpTEFvZ0lDQWdJblI1Y0dVaU9pQWlNaUlLSUNCOUNsMD0iCiAgICAgIH0sCiAgICAgIHsKICAgICAgICAidGl0bGUiOiJCw6BpIDI6IEPDoWNoIHRoaeG6v3QgbOG6rXAgY8O0bmcgdGjhu6ljIHThu6sgY8O0bmcgdGjhu6ljIG7Eg25nIGzGsOG7o25nIiwKICAgICAgICAiZGF0YSI6Ild3b2dJSHNLSUNBZ0lDSjBhWFJzWlNJNklDSldhV1JsYnlCaXc2QnBJR2RwNGJxamJtY2lMQW9nSUNBZ0luVnliQ0k2SUNJeE1uUmhkakZaU3pkaFYzVnVVR1YzVm5GYWN6RXpiVVZIY0dveFNtSllkVE1pTEFvZ0lDQWdJblI1Y0dVaU9pQWlNaUlLSUNCOUxBb2dJSHNLSUNBZ0lDSjBhWFJzWlNJNklDSkdhV3hsSU1TUjRidUJJaXdLSUNBZ0lDSjFjbXdpT2lBaU1UTlhaMGxyVlROa1NrSlNiSEk0V0dORFFtbHVSMVY2TFVaMVQwa3hjbUkySWl3S0lDQWdJQ0owZVhCbElqb2dJakVpQ2lBZ2ZTd0tJQ0I3Q2lBZ0lDQWlkR2wwYkdVaU9pQWlWbWxrWlc4Z1oybmh1cU5wSUdMRG9Ha2dkT0c2clhBaUxBb2dJQ0FnSW5WeWJDSTZJQ0l4TTFkSVExaEJhRGhGTTI5NVNERklXSEY0VHpKVllrNXBaVlpwYmxwR2VsY2lMQW9nSUNBZ0luUjVjR1VpT2lBaU1pSUtJQ0I5Q2wwPSIKICAgICAgfSwKICAgICAgewogICAgICAgICJ0aXRsZSI6IkLDoGkgMzogU8OzbmcgxJFp4buHbiB04burIiwKICAgICAgICAiZGF0YSI6Ilczc2lkR2wwYkdVaU9pSk13NzBnZEdoMWVlRzZ2M1FnYzhPemJtY2d4SkZwNGJ1SGJpQjA0YnVySWl3aWRYSnNJam9pTVRRNVN6VlJOVXBmVTNZNVN6RkVWRVp6TVZBMk1WVXphSFZLYm1scVdHWlNJaXdpZEhsd1pTSTZJaklpZlN4N0luUnBkR3hsSWpvaUtGVGh1NnNnVmtRNElHekRvQ0EzS3lrZ1FzT2dhU0IwNGJxdGNDQno0YnV4SUhSeWRYbmh1NEZ1SUhQRHMyNW5JTVNSYWVHN2gyNGdkT0c3cXlJc0luVnliQ0k2SWpFME4wRlBTVXh3U0VkYVZYWmtSVEl3Y1ROcWRrdzNaMFJRTmtWdFFXaFlZU0lzSW5SNWNHVWlPaUl5SW4wc2V5SjBhWFJzWlNJNklrM2h1cmx2SUhqRG9XTWd4SkhodTR0dWFDQkNWa1VnWk9HN2hTQnVhT0c3bXlJc0luVnliQ0k2SWpFemVGOVBkbDh5YkdVdFZWTkxlRVp6UjJFeFgxbFZSM1JMUkZVdGEzRnpaeUlzSW5SNWNHVWlPaUl3SW4wc2V5SjBhWFJzWlNJNklpZzNLeWtnUXNPZ2FTQjA0YnF0Y0NCMDRidWxJSGh2WVhraUxDSjFjbXdpT2lJeE5EQTRXR3Q1T0U1NlNrczRjbXhNYVRSM2JEZENhR0pHWVdwRFVreHRkWElpTENKMGVYQmxJam9pTWlKOUxIc2lkR2wwYkdVaU9pSkdhV3hsSU1TUjRidUJJaXdpZFhKc0lqb2lNVFJOY1ZwblNITjFPVlZCTTAxcFVHUjNjMWx1TjFrekxUTmtlVTFGZEU5V0lpd2lkSGx3WlNJNklqRWlmU3g3SW5ScGRHeGxJam9pVm1sa1pXOGdZMmpodTY5aElIQm80YnFuYmlBeElpd2lkWEpzSWpvaU1UUm5XbUo0UWt3eFZFTnNTbU5qVnpNNE1sRlJXVzB5ZUY5UUxVcDVRV3BpSWl3aWRIbHdaU0k2SWpJaWZTeDdJblJwZEd4bElqb2lWbWxrWlc4Z1kyamh1NjloSUhCbzRicW5iaUF5SWl3aWRYSnNJam9pTVRSMFR6UlZSMTl5Ykc4eldtUmpYMVIwYWs5blZGbGlSemxtTmpZelIyTk9JaXdpZEhsd1pTSTZJaklpZlYwPSIKICAgICAgfQogICAgXQogIH0KXQ==`,
    `WwogIHsKICAgICJpZCI6ImNodW9uZy01IiwKICAgICJ0aXRsZSI6IkNoxrDGoW5nIDU6IFPDs25nIMOhbmggc8OhbmciLAogICAgImRhdGEiOlsKICAgICAgewogICAgICAgICJ0aXRsZSI6IkLDoGkgMTogVMOhbiBz4bqvYyDDoW5oIHPDoW5nIiwKICAgICAgICAiZGF0YSI6Ild3b2dJSHNLSUNBZ0lDSjBhWFJzWlNJNklDSkR3NkZqYUNCbzRidU5ZeUJ1YU9HN3IyNW5JR05veHJER29XNW5JR04xNGJ1UmFTSXNDaUFnSUNBaWRYSnNJam9nSWpGeFZUZG5iazlzY0ZJelUzWjNTR3R3UmpsRmRHdFhSWEZuT1ZnMmVscGxPQ0lzQ2lBZ0lDQWlkSGx3WlNJNklDSXdJZ29nSUgwc0NpQWdld29nSUNBZ0luUnBkR3hsSWpvZ0lsWnBaR1Z2SUdMRG9Ha2daMm5odXFOdVp5SXNDaUFnSUNBaWRYSnNJam9nSWpFM1QzTkZXV3hIUVhrdFpUVkxWVkJPYTNKVFQzcEZjMnd0UTJSeFMxZEZiQ0lzQ2lBZ0lDQWlkSGx3WlNJNklDSXlJZ29nSUgwc0NpQWdld29nSUNBZ0luUnBkR3hsSWpvZ0lrUERvV01nZHNPdElHVGh1NlVnZE9HN3F5Qms0YnVGSU1TUjRicS9iaUJyYU1Peklpd0tJQ0FnSUNKMWNtd2lPaUFpTVRkVVprOTFTbXBtYkRKSlpXazJlVVJYZUVGTGRIUkRZa1Z5UmpsMVQzVnZJaXdLSUNBZ0lDSjBlWEJsSWpvZ0lqSWlDaUFnZlN3S0lDQjdDaUFnSUNBaWRHbDBiR1VpT2lBaVUrRzdyV0VnYk9HNm9Xa2djR2pEdW5RZ09WOHdNQ0J3YU9HNnAyNGdNaUlzQ2lBZ0lDQWlkWEpzSWpvZ0lqRkdORUpHU25WVWJqWjNTWFZvYnpaZlJFYzBiWGxoVERSeVVuRTNWV016VmlJc0NpQWdJQ0FpZEhsd1pTSTZJQ0l3SWdvZ0lIMHNDaUFnZXdvZ0lDQWdJblJwZEd4bElqb2dJa1pwYkdVZ3hKSGh1NEVpTEFvZ0lDQWdJblZ5YkNJNklDSXhUbEZZTTNWNFRERjRTM1pSTWtJemNqQnBlbkpyTUZSWlZuUnVibkJmVUVZaUxBb2dJQ0FnSW5SNWNHVWlPaUFpTVNJS0lDQjlMQW9nSUhzS0lDQWdJQ0owYVhSc1pTSTZJQ0pVNGJ1VmJtY2d3N1J1SUMwZ1Iybmh1cU5wSUdMRG9Ha2dkT0c2clhBaUxBb2dJQ0FnSW5WeWJDSTZJQ0l4Y2toTU5reHVRVFYwUlVwMmQzUnNRazlvVFhKQ1dGcHhPV0oxVm5WdE1EUWlMQW9nSUNBZ0luUjVjR1VpT2lBaU1pSUtJQ0I5Q2wwPSIKICAgICAgfSwKICAgICAgewogICAgICAgICJ0aXRsZSI6IkLDoGkgMjogR2lhbyB0aG9hIMOhbmggc8OhbmcgxJHGoW4gc+G6r2MgcGjhuqduIDEiLAogICAgICAgICJkYXRhIjoiV3dvZ0lIc0tJQ0FnSUNKMGFYUnNaU0k2SUNKV2FXUmxieUJpdzZCcElHZHA0YnFqYm1jZ2NHamh1cWR1SURFaUxBb2dJQ0FnSW5WeWJDSTZJQ0l4Y1d4WmQwc3lOak5EYm5GWk9GbFNlV053YlhoQ2JqTlVOMlZTWHkweE9VOGlMQW9nSUNBZ0luUjVjR1VpT2lBaU1pSUtJQ0I5TEFvZ0lIc0tJQ0FnSUNKMGFYUnNaU0k2SUNKRHc2RmpJSGJEclNCazRidWxJRGdySWl3S0lDQWdJQ0oxY213aU9pQWlNV2RPU1VWZmJFZHNTbHBuUzNrd1FXeFNha1ZHUVRaaFpsaGlOakJtUVU5M0lpd0tJQ0FnSUNKMGVYQmxJam9nSWpJaUNpQWdmU3dLSUNCN0NpQWdJQ0FpZEdsMGJHVWlPaUFpUTJqRHVpRER2U0lzQ2lBZ0lDQWlkWEpzSWpvZ0lqRTRNbTAzZVZWWGRFOXdhRVYyTWtFeGREVktablpGZVdsRmFreG1UbFkwVFNJc0NpQWdJQ0FpZEhsd1pTSTZJQ0l3SWdvZ0lIMHNDaUFnZXdvZ0lDQWdJblJwZEd4bElqb2dJa1pKVEVVZ3hKRGh1NEFpTEFvZ0lDQWdJblZ5YkNJNklDSXhjRXRFT0cxc2VXVXRkRU0wV2s1TVdUWklSbUZuWWxKM1VHMU5RakpwVWpNaUxBb2dJQ0FnSW5SNWNHVWlPaUFpTVNJS0lDQjlMQW9nSUhzS0lDQWdJQ0owYVhSc1pTSTZJQ0pXYVdSbGJ5Qm5hZUc2bzJrZ1lzT2dhU0IwNGJxdGNDSXNDaUFnSUNBaWRYSnNJam9nSWpFMlZFRkxOVGhGVTBJdGIyUjRUemg2WnpaTlIxSTVaWFY1VUZaZk9FOXdlU0lzQ2lBZ0lDQWlkSGx3WlNJNklDSXlJZ29nSUgwS1hRPT0iCiAgICAgIH0sCiAgICAgIHsKICAgICAgICAidGl0bGUiOiJCw6BpIDIuMTogR2lhbyB0aG9hIMOhbmggc8OhbmcgxJHGoW4gc+G6r2MgcGjhuqduIDIiLAogICAgICAgICJkYXRhIjoiV3dvZ0lIc0tJQ0FnSUNKMGFYUnNaU0k2SUNKR2FXeGxJTVNSNGJ1Qklpd0tJQ0FnSUNKMWNtd2lPaUFpTVdRNVMyZHZZMUpmZG1KNk5UUjVPVGs0V0c5bU0wNU5hVVZ1YTJjeGJsQkVJaXdLSUNBZ0lDSjBlWEJsSWpvZ0lqRWlDaUFnZlN3S0lDQjdDaUFnSUNBaWRHbDBiR1VpT2lBaVZtbGtaVzhnWjJuaHVxTnBJR05vYVNCMGFlRzZ2M1FnWThPaWRTQXhMVEkwSWl3S0lDQWdJQ0oxY213aU9pQWlUbXByTUNJc0NpQWdJQ0FpZEhsd1pTSTZJQ0l6SWdvZ0lIMHNDaUFnZXdvZ0lDQWdJblJwZEd4bElqb2dJbFpwWkdWdklHZHA0YnFqYVNCamFHa2dkR25odXI5MElESTFMVE0wSWl3S0lDQWdJQ0oxY213aU9pQWlUbXByTVNJc0NpQWdJQ0FpZEhsd1pTSTZJQ0l6SWdvZ0lIMHNDaUFnZXdvZ0lDQWdJblJwZEd4bElqb2dJbFpwWkdWdklHZHA0YnFqYVNCamFHa2dkR25odXI5MElHUERvV01nWThPaWRTSXNDaUFnSUNBaWRYSnNJam9nSWs1cWF6SWlMQW9nSUNBZ0luUjVjR1VpT2lBaU15SUtJQ0I5TEFvZ0lIc0tJQ0FnSUNKMGFYUnNaU0k2SUNKTXc2QnRJSFJvdzZwdElHUERvblVnYnNPZ2VTQm9ZWGtnYm1qRHFTSXNDaUFnSUNBaWRYSnNJam9nSWpGS1dTMWhRVE5JU20xQ2JsWklUemswWDJOYVdWTjViMXB5Um5aQlgyRlNOU0lzQ2lBZ0lDQWlkSGx3WlNJNklDSXlJZ29nSUgwS1hRPT0iCiAgICAgIH0sCiAgICAgIHsKICAgICAgICAidGl0bGUiOiJCw6BpIDM6IEdpYW8gdGhvYSDDoW5oIHPDoW5nIHRy4bqvbmciLAogICAgICAgICJkYXRhIjoiV3dvZ0lIc0tJQ0FnSUNKMGFYUnNaU0k2SUNKUWFPRzZwMjRnTVM0Z1ZtbGtaVzhnWXNPZ2FTQm5hZUc2bzI1bklHUEdvU0lzQ2lBZ0lDQWlkWEpzSWpvZ0lqRlJPRzh0WW10TmMyWTJMV2RsVGs1aWQxUnBhRlJLVHpONmFIazJUbmhwZFNJc0NpQWdJQ0FpZEhsd1pTSTZJQ0l5SWdvZ0lIMHNDaUFnZXdvZ0lDQWdJblJwZEd4bElqb2dJbEJvNGJxbmJpQXlMaUJXYVdSbGJ5Qml3NkJwSUdkcDRicWpibWNnYnNPaWJtY2dZMkZ2SUNnNEt5a2dJaXdLSUNBZ0lDSjFjbXdpT2lBaU1VWkdUVGRPVldocGVtZ3dNWFpUV0VJNVJuTnBWbTVLTkdGUmNqTkdWbmR2SWl3S0lDQWdJQ0owZVhCbElqb2dJaklpQ2lBZ2ZTd0tJQ0I3Q2lBZ0lDQWlkR2wwYkdVaU9pQWlSbWxzWlNERWtlRzdnU0lzQ2lBZ0lDQWlkWEpzSWpvZ0lqRjJkVm93V1dKR2FUSkhVM1pWTW1aR2J6QkhkVU54UmpOd2VWODJNMjFzTlNJc0NpQWdJQ0FpZEhsd1pTSTZJQ0l4SWdvZ0lIMHNDaUFnZXdvZ0lDQWdJblJwZEd4bElqb2dJbFpwWkdWdklHZHA0YnFqYVNCamFHa2dkR25odXI5MElpd0tJQ0FnSUNKMWNtd2lPaUFpTVVGeVpITktjbDlNY1dOemFHUTRTM1ZZVjB4dVJXcDZZekk1ZVVWTVNVeFZJaXdLSUNBZ0lDSjBlWEJsSWpvZ0lqSWlDaUFnZlFwZCIKICAgICAgfSwKICAgICAgewogICAgICAgICJ0aXRsZSI6IkLDoGkgNDogR2lhbyB0aG9hIDIgYuG7qWMgeOG6oSIsCiAgICAgICAgImRhdGEiOiJXd29nSUhzS0lDQWdJQ0owYVhSc1pTSTZJQ0pXYVdSbGJ5Qml3NkJwSUdkcDRicWpibWNpTEFvZ0lDQWdJblZ5YkNJNklDSXhjbWRIVURkbllsRjNhbTFpUzBGR1dVb3djREptYms5UWNIWkZlVmhqU0ZvaUxBb2dJQ0FnSW5SNWNHVWlPaUFpTWlJS0lDQjlMQW9nSUhzS0lDQWdJQ0owYVhSc1pTSTZJQ0pUNGJ1dFlTQm5hV0Z2SUhSb2IyRWdNaUJpNGJ1cFl5QjQ0YnFoSWl3S0lDQWdJQ0oxY213aU9pQWlNVE5UWTNZM01YUmpORkJ3YkhOb1NXTXlXbFI1VlhVMFFUUklhbXRWU1hwU0lpd0tJQ0FnSUNKMGVYQmxJam9nSWpBaUNpQWdmU3dLSUNCN0NpQWdJQ0FpZEdsMGJHVWlPaUFpUm1sc1pTREVrZUc3Z1NJc0NpQWdJQ0FpZFhKc0lqb2dJakZhTW1jNVlrZEVXR1Y1YlZkNGQxTlZNa2RPWDNoSVprOXpNR1ZDVUUwNFpTSXNDaUFnSUNBaWRIbHdaU0k2SUNJeElnb2dJSDBzQ2lBZ2V3b2dJQ0FnSW5ScGRHeGxJam9nSWxacFpHVnZJR2RwNGJxamFTQmphR2tnZEduaHVyOTBJaXdLSUNBZ0lDSjFjbXdpT2lBaU1UWlVhMFJJYldVM1VuQTJWakk0U1U5eVoxSnlMVTVLT1U1VVZUTnBNR2hoSWl3S0lDQWdJQ0owZVhCbElqb2dJaklpQ2lBZ2ZRcGQiCiAgICAgIH0sCiAgICAgIHsKICAgICAgICAidGl0bGUiOiJCw6BpIDU6IEdpYW8gdGhvYSAzIGLhu6ljIHjhuqEsIHbDom4gdOG7kWkgdHLDuW5nIHThu5FpLCBzw6FuZyB0csO5bmcgdOG7kWkgKDgrKSIsCiAgICAgICAgImRhdGEiOiJXd29nSUhzS0lDQWdJQ0owYVhSc1pTSTZJQ0pXYVdSbGJ5Qml3NkJwSUdkcDRicWpibWNnWjJsaGJ5QjBhRzloSURNZ1l1RzdxV01nZU9HNm9TSXNDaUFnSUNBaWRYSnNJam9nSWpGTGVVVldZekExTW1sNFZVcFNOVzgwY21OSmNYVkhlSFZaT0ZkT01VZEhRU0lzQ2lBZ0lDQWlkSGx3WlNJNklDSXlJZ29nSUgwc0NpQWdld29nSUNBZ0luUnBkR3hsSWpvZ0lsWnBaR1Z2SUdMRG9Ha2daMm5odXFOdVp5QjJ3Nkp1SUhUaHU1RnBJSFJ5dzdsdVp5QjA0YnVSYVNBdElIUERvVzVuSUhSeXc3bHVaeUIwNGJ1UmFTSXNDaUFnSUNBaWRYSnNJam9nSWpFelNrczJjRkY0WldONFJsaEhSVEU0YWtKaFdUbEZlV1JKV0dFeGIyNXRTQ0lzQ2lBZ0lDQWlkSGx3WlNJNklDSXlJZ29nSUgwc0NpQWdld29nSUNBZ0luUnBkR3hsSWpvZ0lrWnBiR1VneEpIaHU0RWlMQW9nSUNBZ0luVnliQ0k2SUNJeE9HaGZjVkpMVG5OaWRsaHRNMnhKYkVGamVVcFBOM0p1YWtSRWMwMXRjVFlpTEFvZ0lDQWdJblI1Y0dVaU9pQWlNU0lLSUNCOUxBb2dJSHNLSUNBZ0lDSjBhWFJzWlNJNklDSkdhV3hsSUdkcDRicWphU0JqYUdrZ2RHbmh1cjkwSWl3S0lDQWdJQ0oxY213aU9pQWlNVU5EZDJGNVZXSXhRMVZLYUROck1YSndRVkJ2TkVaamMwUnFZVGhoU21OQklpd0tJQ0FnSUNKMGVYQmxJam9nSWpFaUNpQWdmUXBkIgogICAgICB9LAogICAgICB7CiAgICAgICAgInRpdGxlIjoiQsOgaSA2OiBNw6F5IHF1YW5nIHBo4buVIiwKICAgICAgICAiZGF0YSI6Ild3b2dJSHNLSUNBZ0lDSjBhWFJzWlNJNklDSldhV1JsYnlCaXc2QnBJR2RwNGJxamJtY2diY09oZVNCeGRXRnVaeUJ3YU9HN2xTQWlMQW9nSUNBZ0luVnliQ0k2SUNJeFpVTjFiMkZuY210MGN6bEJhSGRRV20xTmJXaHVjMUZLVUZCYVFtVmtkWGtpTEFvZ0lDQWdJblI1Y0dVaU9pQWlNaUlLSUNCOUxBb2dJSHNLSUNBZ0lDSjBhWFJzWlNJNklDSkdTVXhGSU1TUTRidUFJaXdLSUNBZ0lDSjFjbXdpT2lBaU1YUTNaamwxTm1OSVYzQTBTM2RQWm01TldWSXdUMjVVVTI5U2RGRjBRVTVaSWl3S0lDQWdJQ0owZVhCbElqb2dJakVpQ2lBZ2ZTd0tJQ0I3Q2lBZ0lDQWlkR2wwYkdVaU9pQWlWbWxrWlc4Z1oybmh1cU5wSUdOb2FTQjBhZUc2djNRaUxBb2dJQ0FnSW5WeWJDSTZJQ0l4ZG05RlZYQlBialZsY0RJeGNUbExkakpyVG1SU2RWbFVSVU0yUm5ZdE4yVWlMQW9nSUNBZ0luUjVjR1VpT2lBaU1pSUtJQ0I5Q2wwPSIKICAgICAgfSwKICAgICAgewogICAgICAgICJ0aXRsZSI6IkLDoGkgNzogQ8OhYyBsb+G6oWkgdGlhIiwKICAgICAgICAiZGF0YSI6Ild3b2dJSHNLSUNBZ0lDSjBhWFJzWlNJNklDSldhV1JsYnlCaXc2QnBJR2RwNGJxamJtY2dZOE9oWXlCc2IrRzZvV2tnZEdsaElpd0tJQ0FnSUNKMWNtd2lPaUFpTVVwTmVXZFVXakZvUTNreGNXRktXbVJuUWsxaWRtOXBPR1UzZDFSa1lVWlZJaXdLSUNBZ0lDSjBlWEJsSWpvZ0lqSWlDaUFnZlN3S0lDQjdDaUFnSUNBaWRHbDBiR1VpT2lBaVJtbHNaU0RFa2VHN2dTSXNDaUFnSUNBaWRYSnNJam9nSWpGdU5raGtTSFZaYWtGMWRGWklXa3AzVm1kd1NrbHBkVTkwY0c5b2FHaGtWeUlzQ2lBZ0lDQWlkSGx3WlNJNklDSXhJZ29nSUgwc0NpQWdld29nSUNBZ0luUnBkR3hsSWpvZ0lrTm80YnVsY0NCWUlIRjFZVzVuSUdQRHN5QnVaM1Y1SUdocDRidURiU0JyYU1PMGJtY2lMQW9nSUNBZ0luVnliQ0k2SUNJeGMyazNkRmd6UVdoamRXYzFaV3hDUW1aYVdYSXpjelJTZWpGbWJ6RjZSV0lpTEFvZ0lDQWdJblI1Y0dVaU9pQWlNaUlLSUNCOUNsMD0iCiAgICAgIH0KICAgIF0KICB9Cl0K`
    ];
    for(e of s) tai_chuong(e);
})