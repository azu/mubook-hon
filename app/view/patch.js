import DefaultManager from "epubjs/lib/managers/default/index.js"

console.log({
    DefaultManager
})
DefaultManager.prototype.moveTo = function (offset, width) {
    var distX = 0,
        distY = 0;
    
    if (!this.isPaginated) {
        distY = offset.top;
    } else {
        distX = Math.floor(offset.left / this.layout.delta) * this.layout.delta;
        
        if (distX + this.layout.delta > this.container.scrollWidth) {
            distX = this.container.scrollWidth - this.layout.delta;
        }
        
        distY = Math.floor(offset.top / this.layout.delta) * this.layout.height;
        if (distY + this.layout.height > this.container.scrollHeight) {
            distY = this.container.scrollHeight - this.layout.height;
        }
        console.log({
            distY
        })
    }
    if (this.settings.direction === 'rtl') {
        /***
         the `floor` function above (L343) is on positive values, so we should add one `layout.delta`
         to distX or use `Math.ceil` function, or multiply offset.left by -1
         before `Math.floor`
         */
        distX = distX + this.layout.delta;
        distX = distX - width;
        console.log("rlt", {
            distY
        })
    }
    console.log({
        distX,
        distY
    })
    this.scrollTo(distX, distY, true);
}
DefaultManager.prototype.next = function next() {
    console.log("nnnn")
    var next;
    var left;
    let dir = this.settings.direction;
    if (!this.views.length) return;
    
    if (this.isPaginated && this.settings.axis === "horizontal" && (!dir || dir === "ltr")) {
        this.scrollLeft = this.container.scrollLeft;
        left = this.container.scrollLeft + this.container.offsetWidth + this.layout.delta;
        
        if (left <= this.container.scrollWidth) {
            this.scrollBy(this.layout.height, 0, true);
        } else {
            next = this.views.last().section.next();
        }
    } else if (this.isPaginated && this.settings.axis === "horizontal" && dir === "rtl") {
        this.scrollLeft = this.container.scrollLeft;
        
        if (this.settings.rtlScrollType === "default") {
            left = this.container.scrollLeft;
            
            if (left > 0) {
                this.scrollBy(this.layout.height, 0, true);
            } else {
                next = this.views.last().section.next();
            }
        } else {
            left = this.container.scrollLeft + this.layout.height * -1;
            
            if (left > this.container.scrollWidth * -1) {
                this.scrollBy(this.layout.height, 0, true);
            } else {
                next = this.views.last().section.next();
            }
        }
    } else if (this.isPaginated && this.settings.axis === "vertical") {
        this.scrollTop = this.container.scrollTop;
        let top = this.container.scrollTop + this.container.offsetHeight;
        
        if (top < this.container.scrollHeight) {
            this.scrollBy(0, this.layout.height, true);
        } else {
            next = this.views.last().section.next();
        }
    } else {
        next = this.views.last().section.next();
    }
    
    if (next) {
        this.clear(); // The new section may have a different writing-mode from the old section. Thus, we need to update layout.
        
        this.updateLayout();
        let forceRight = false;
        
        if (this.layout.name === "pre-paginated" && this.layout.divisor === 2 && next.properties.includes("page-spread-right")) {
            forceRight = true;
        }
        
        return this.append(next, forceRight).then(function () {
            return this.handleNextPrePaginated(forceRight, next, this.append);
        }.bind(this), err => {
            return err;
        }).then(function () {
            // Reset position to start for scrolled-doc vertical-rl in default mode
            if (!this.isPaginated && this.settings.axis === "horizontal" && this.settings.direction === "rtl" && this.settings.rtlScrollType === "default") {
                this.scrollTo(this.container.scrollWidth, 0, true);
            }
            
            this.views.show();
        }.bind(this));
    }
}
