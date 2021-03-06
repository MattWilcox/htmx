describe("Core htmx AJAX Tests", function(){
    beforeEach(function() {
        this.server = makeServer();
        clearWorkArea();
    });
    afterEach(function()  {
        this.server.restore();
        clearWorkArea();
    });

    // bootstrap test
    it('issues a GET request on click and swaps content', function()
    {
        this.server.respondWith("GET", "/test", "Clicked!");

        var btn = make('<button hx-get="/test">Click Me!</button>')
        btn.click();
        this.server.respond();
        btn.innerHTML.should.equal("Clicked!");
    });

    it('processes inner content properly', function()
    {
        this.server.respondWith("GET", "/test", '<a hx-get="/test2">Click Me</a>');
        this.server.respondWith("GET", "/test2", "Clicked!");

        var div = make('<div hx-get="/test"></div>')
        div.click();
        this.server.respond();
        div.innerHTML.should.equal('<a hx-get="/test2">Click Me</a>');
        var a = div.querySelector('a');
        a.click();
        this.server.respond();
        a.innerHTML.should.equal('Clicked!');
    });

    it('handles swap outerHTML properly', function()
    {
        this.server.respondWith("GET", "/test", '<a id="a1" hx-get="/test2">Click Me</a>');
        this.server.respondWith("GET", "/test2", "Clicked!");

        var div = make('<div id="d1" hx-get="/test" hx-swap="outerHTML"></div>')
        div.click();
        should.equal(byId("d1"), div);
        this.server.respond();
        should.equal(byId("d1"), null);
        byId("a1").click();
        this.server.respond();
        byId("a1").innerHTML.should.equal('Clicked!');
    });

    it('handles beforebegin properly', function()
    {
        var i = 0;
        this.server.respondWith("GET", "/test", function(xhr){
            i++;
            xhr.respond(200, {}, '<a id="a' + i + '" hx-get="/test2" hx-swap="innerHTML">' + i + '</a>');
        });
        this.server.respondWith("GET", "/test2", "*");

        var div = make('<div hx-get="/test" hx-swap="beforebegin">*</div>')
        var parent = div.parentElement;
        div.click();
        this.server.respond();
        div.innerText.should.equal("*");
        removeWhiteSpace(parent.innerText).should.equal("1*");

        byId("a1").click();
        this.server.respond();
        removeWhiteSpace(parent.innerText).should.equal("**");

        div.click();
        this.server.respond();
        div.innerText.should.equal("*");
        removeWhiteSpace(parent.innerText).should.equal("*2*");

        byId("a2").click();
        this.server.respond();
        removeWhiteSpace(parent.innerText).should.equal("***");
    });

    it('handles afterbegin properly', function()
    {
        var i = 0;
        this.server.respondWith("GET", "/test", function(xhr){
            i++;
            xhr.respond(200, {}, '<a id="a' + i + '" hx-get="/test2" hx-swap="innerHTML">' + i + '</a>');
        });
        this.server.respondWith("GET", "/test2", "*");

        var div = make('<div hx-get="/test" hx-swap="afterbegin">*</div>')
        div.click();
        this.server.respond();
        div.innerText.should.equal("1*");

        byId("a1").click();
        this.server.respond();
        div.innerText.should.equal("**");

        div.click();
        this.server.respond();
        div.innerText.should.equal("2**");

        byId("a2").click();
        this.server.respond();
        div.innerText.should.equal("***");
    });

    it('handles afterbegin properly with no initial content', function()
    {
        var i = 0;
        this.server.respondWith("GET", "/test", function(xhr){
            i++;
            xhr.respond(200, {}, '<a id="a' + i + '" hx-get="/test2" hx-swap="innerHTML">' + i + '</a>');
        });
        this.server.respondWith("GET", "/test2", "*");

        var div = make('<div hx-get="/test" hx-swap="afterbegin"></div>')
        div.click();
        this.server.respond();
        div.innerText.should.equal("1");

        byId("a1").click();
        this.server.respond();
        div.innerText.should.equal("*");

        div.click();
        this.server.respond();
        div.innerText.should.equal("2*");

        byId("a2").click();
        this.server.respond();
        div.innerText.should.equal("**");
    });

    it('handles afterend properly', function()
    {
        var i = 0;
        this.server.respondWith("GET", "/test", function(xhr){
            i++;
            xhr.respond(200, {}, '<a id="a' + i + '" hx-get="/test2" hx-swap="innerHTML">' + i + '</a>');
        });
        this.server.respondWith("GET", "/test2", "*");

        var div = make('<div hx-get="/test" hx-swap="afterend">*</div>')
        var parent = div.parentElement;
        div.click();
        this.server.respond();
        div.innerText.should.equal("*");
        removeWhiteSpace(parent.innerText).should.equal("*1");

        byId("a1").click();
        this.server.respond();
        removeWhiteSpace(parent.innerText).should.equal("**");

        div.click();
        this.server.respond();
        div.innerText.should.equal("*");
        removeWhiteSpace(parent.innerText).should.equal("*2*");

        byId("a2").click();
        this.server.respond();
        removeWhiteSpace(parent.innerText).should.equal("***");
    });

    it('handles beforeend properly', function()
    {
        var i = 0;
        this.server.respondWith("GET", "/test", function(xhr){
            i++;
            xhr.respond(200, {}, '<a id="a' + i + '" hx-get="/test2" hx-swap="innerHTML">' + i + '</a>');
        });
        this.server.respondWith("GET", "/test2", "*");

        var div = make('<div hx-get="/test" hx-swap="beforeend">*</div>')
        div.click();
        this.server.respond();
        div.innerText.should.equal("*1");

        byId("a1").click();
        this.server.respond();
        div.innerText.should.equal("**");

        div.click();
        this.server.respond();
        div.innerText.should.equal("**2");

        byId("a2").click();
        this.server.respond();
        div.innerText.should.equal("***");
    });

    it('handles beforeend properly with no initial content', function()
    {
        var i = 0;
        this.server.respondWith("GET", "/test", function(xhr){
            i++;
            xhr.respond(200, {}, '<a id="a' + i + '" hx-get="/test2" hx-swap="innerHTML">' + i + '</a>');
        });
        this.server.respondWith("GET", "/test2", "*");

        var div = make('<div hx-get="/test" hx-swap="beforeend"></div>')
        div.click();
        this.server.respond();
        div.innerText.should.equal("1");

        byId("a1").click();
        this.server.respond();
        div.innerText.should.equal("*");

        div.click();
        this.server.respond();
        div.innerText.should.equal("*2");

        byId("a2").click();
        this.server.respond();
        div.innerText.should.equal("**");
    });

    it('handles hx-target properly', function()
    {
        this.server.respondWith("GET", "/test", "Clicked!");

        var btn = make('<button hx-get="/test" hx-target="#s1">Click Me!</button>');
        var target = make('<span id="s1">Initial</span>');
        btn.click();
        target.innerHTML.should.equal("Initial");
        this.server.respond();
        target.innerHTML.should.equal("Clicked!");
    });

    it('handles 204 NO CONTENT responses properly', function()
    {
        this.server.respondWith("GET", "/test", [204, {}, "No Content!"]);

        var btn = make('<button hx-get="/test">Click Me!</button>');
        btn.click();
        btn.innerHTML.should.equal("Click Me!");
        this.server.respond();
        btn.innerHTML.should.equal("Click Me!");
    });

    it('handles hx-trigger with non-default value', function()
    {
        this.server.respondWith("GET", "/test", "Clicked!");

        var form = make('<form hx-get="/test" hx-trigger="click">Click Me!</form>');
        form.click();
        form.innerHTML.should.equal("Click Me!");
        this.server.respond();
        form.innerHTML.should.equal("Clicked!");
    });

    it('handles hx-trigger with load event', function()
    {
        this.server.respondWith("GET", "/test", "Loaded!");
        var div = make('<div hx-get="/test" hx-trigger="load">Load Me!</div>');
        div.innerHTML.should.equal("Load Me!");
        this.server.respond();
        div.innerHTML.should.equal("Loaded!");
    });

    it('sets the content type of the request properly', function (done) {
        this.server.respondWith("GET", "/test", function(xhr){
            xhr.respond(200, {}, "done");
            xhr.overriddenMimeType.should.equal("text/html");
            done();
        });
        var div = make('<div hx-get="/test">Click Me!</div>');
        div.click();
        this.server.respond();
    });

    it('issues two requests when clicked twice before response', function()
    {
        var i = 1;
        this.server.respondWith("GET", "/test", function (xhr) {
            xhr.respond(200, {}, "click " + i);
            i++
        });
        var div = make('<div hx-get="/test"></div>');
        div.click();
        div.click();
        this.server.respond();
        div.innerHTML.should.equal("click 1");
        this.server.respond();
        div.innerHTML.should.equal("click 2");
    });

    it('issues two requests when clicked three times before response', function()
    {
        var i = 1;
        this.server.respondWith("GET", "/test", function (xhr) {
            xhr.respond(200, {}, "click " + i);
            i++
        });
        var div = make('<div hx-get="/test"></div>');
        div.click();
        div.click();
        div.click();
        this.server.respondAll();
        div.innerHTML.should.equal("click 2");
    });

    it('properly handles hx-select for basic situation', function()
    {
        var i = 1;
        this.server.respondWith("GET", "/test", "<div id='d1'>foo</div><div id='d2'>bar</div>");
        var div = make('<div hx-get="/test" hx-select="#d1"></div>');
        div.click();
        this.server.respond();
        div.innerHTML.should.equal("<div id=\"d1\">foo</div>");
    });

    it('properly handles hx-select for full html document situation', function()
    {
        this.server.respondWith("GET", "/test", "<html><body><div id='d1'>foo</div><div id='d2'>bar</div></body></html>");
        var div = make('<div hx-get="/test" hx-select="#d1"></div>');
        div.click();
        this.server.respond();
        div.innerHTML.should.equal("<div id=\"d1\">foo</div>");
    });

    it('properly settles attributes on interior elements', function(done)
    {
        this.server.respondWith("GET", "/test", "<div hx-get='/test'><div foo='bar' id='d1'></div></div>");
        var div = make("<div hx-get='/test' hx-swap='outerHTML settle:10ms'><div id='d1'></div></div>");
        div.click();
        this.server.respond();
        should.equal(byId("d1").getAttribute("foo"), null);
        setTimeout(function () {
            should.equal(byId("d1").getAttribute("foo"), "bar");
            done();
        }, 20);
    });

    it('properly handles checkbox inputs', function()
    {
        var values;
        this.server.respondWith("Post", "/test", function (xhr) {
            values = getParameters(xhr);
            xhr.respond(204, {}, "");
        });

        var form = make('<form hx-post="/test" hx-trigger="click">' +
            '<input id="cb1" name="c1" value="cb1" type="checkbox">'+
            '<input id="cb2" name="c1" value="cb2" type="checkbox">'+
            '<input id="cb3" name="c1" value="cb3" type="checkbox">'+
            '<input id="cb4" name="c2" value="cb4"  type="checkbox">'+
            '<input id="cb5" name="c2" value="cb5"  type="checkbox">'+
            '<input id="cb6" name="c3" value="cb6"  type="checkbox">'+
            '</form>');

        form.click();
        this.server.respond();
        values.should.deep.equal({});

        byId("cb1").checked = true;
        form.click();
        this.server.respond();
        values.should.deep.equal({c1:"cb1"});

        byId("cb1").checked = true;
        byId("cb2").checked = true;
        form.click();
        this.server.respond();
        values.should.deep.equal({c1:["cb1", "cb2"]});

        byId("cb1").checked = true;
        byId("cb2").checked = true;
        byId("cb3").checked = true;
        form.click();
        this.server.respond();
        values.should.deep.equal({c1:["cb1", "cb2", "cb3"]});

        byId("cb1").checked = true;
        byId("cb2").checked = true;
        byId("cb3").checked = true;
        byId("cb4").checked = true;
        form.click();
        this.server.respond();
        values.should.deep.equal({c1:["cb1", "cb2", "cb3"], c2:"cb4"});

        byId("cb1").checked = true;
        byId("cb2").checked = true;
        byId("cb3").checked = true;
        byId("cb4").checked = true;
        byId("cb5").checked = true;
        form.click();
        this.server.respond();
        values.should.deep.equal({c1:["cb1", "cb2", "cb3"], c2:["cb4", "cb5"]});

        byId("cb1").checked = true;
        byId("cb2").checked = true;
        byId("cb3").checked = true;
        byId("cb4").checked = true;
        byId("cb5").checked = true;
        byId("cb6").checked = true;
        form.click();
        this.server.respond();
        values.should.deep.equal({c1:["cb1", "cb2", "cb3"], c2:["cb4", "cb5"], c3:"cb6"});

        byId("cb1").checked = true;
        byId("cb2").checked = false;
        byId("cb3").checked = true;
        byId("cb4").checked = false;
        byId("cb5").checked = true;
        byId("cb6").checked = true;
        form.click();
        this.server.respond();
        values.should.deep.equal({c1:["cb1", "cb3"], c2:"cb5", c3:"cb6"});

    });

    it('text nodes dont screw up settling via variable capture', function()
    {
        this.server.respondWith("GET", "/test", "<div id='d1' hx-get='/test2'></div>fooo");
        this.server.respondWith("GET", "/test2", "clicked");
        var div = make("<div hx-get='/test'/>");
        div.click();
        this.server.respond();
        byId("d1").click();
        this.server.respond();
        byId("d1").innerHTML.should.equal("clicked");
    });

    var globalWasCalled = false;
    window.callGlobal = function() {
        globalWasCalled = true;
    }

    it('script nodes evaluate', function()
    {
        try {
            this.server.respondWith("GET", "/test", "<div></div><script type='text/javascript'>callGlobal()</script>");
            var div = make("<div hx-get='/test'></div>");
            div.click();
            this.server.respond();
            globalWasCalled.should.equal(true);
        } finally {
            delete window.callGlobal;
        }
    });

    it('script node exceptions do not break rendering', function()
    {
        this.server.respondWith("GET", "/test", "clicked<script type='text/javascript'>throw 'foo';</script>");
        var div = make("<div hx-get='/test'></div>");
        div.click();
        this.server.respond();
        div.innerText.should.equal("clicked");
    });

    it('allows empty verb values', function()
    {
        var path = null;
        var div = make("<div hx-get=''/>");
        htmx.on(div, "htmx:configRequest", function (evt) {
            path = evt.detail.path;
            return false;
        });
        div.click();
        this.server.respond();
        path.should.not.be.null;
    });

    it('allows blank verb values', function()
    {
        var path = null;
        var div = make("<div hx-get/>");
        htmx.on(div, "htmx:configRequest", function (evt) {
            path = evt.detail.path;
            return false;
        });
        div.click();
        this.server.respond();
        path.should.not.be.null;
    });

    it('input values are not settle swapped (causes flicker)', function()
    {
        this.server.respondWith("GET", "/test", "<input id='i1' value='bar'/>");
        var input = make("<input id='i1' hx-get='/test' value='foo' hx-swap='outerHTML settle:50' hx-trigger='click'/>");
        input.click();
        this.server.respond();
        input = byId('i1');
        input.value.should.equal('bar');
    });


})
