function f(t){return{all:t=t||new Map,on:function(e,n){var i=t.get(e);i?i.push(n):t.set(e,[n])},off:function(e,n){var i=t.get(e);i&&(n?i.splice(i.indexOf(n)>>>0,1):t.set(e,[]))},emit:function(e,n){var i=t.get(e);i&&i.slice().map(function(c){c(n)}),(i=t.get("*"))&&i.slice().map(function(c){c(e,n)})}}}export{f as Q};
