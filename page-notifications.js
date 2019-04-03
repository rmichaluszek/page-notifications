/*version 1.0.2*/
function PageNotifications(args = {width:360}) {
    //constructor

    //theme
    if(args.theme=="dark") {
        this.theme = "dark";
    } else {
        this.theme = "light";
    }
    //parent element
    if(args.parentDiv&&document.getElementById(args.parentDiv)) {
        this.parentDiv = document.getElementById(args.parentDiv);
    } else {
        this.parentDiv = document.body;
    }
    //target width of notifications
    if(args.width&&!isNaN(args.width)) {
        this.width = args.width;
    } else {
        console.log(this.parentDiv.offsetWidth)
        this.width = this.parentDiv.offsetWidth;
    }

    this.pageNotifications = [];
    this.lastNotificationIdNumber = 0;

    this.notificationsDurationsTimers = {};
    this.notificationsDurationsTimeouts = {};
    this.notificationsDurationsLoop = null;

    this.deltaLastUpdate =  Date.now();

    this.container = document.createElement('div');
    this.container.id = 'page-notifications-container';
    this.container.style.maxWidth = this.width+"px";
    this.parentDiv.appendChild(this.container);

    this.update = setInterval(function() {
        var now = Date.now();
        var deltaTime = now-this.deltaLastUpdate;
        this.deltaLastUpdate = now;

        for(let id = 0; id < this.pageNotifications.length; id++) {
            this.pageNotifications[id].update(deltaTime);
            if(this.pageNotifications[id].toDelete) {
                this.pageNotifications.splice(id,1);
            }
        }
        
    }.bind(this),17);

    this.push = function(title,content,type,duration) {
        this.lastNotificationIdNumber++;
        var notificationId = "pn"+this.lastNotificationIdNumber;
        this.pageNotifications.push(new PageNotification(notificationId,title,content,type,duration,this.container,this.theme,this.width));
    }   
    this.closeAll = function(){
        for(let id = 0; id < this.pageNotifications.length; id++) {
            this.pageNotifications[id].close();
        }
    }
}

function PageNotification(pnId,title,content,type,duration,container,theme,width) {
    this.pnId = pnId;
    this.title = title;
    this.content = content;
    this.type = type;
    this.duration = duration;
    this.durationLeft = duration;
    this.theme = theme;
    this.width = width;

    this.heightScale = 0;  //from 0 to 1, variable used to make animations of showing/hiding
    this.heightCurrentAnimation = 1 // 0 - nothing, 1 - showup, 2 - hide
    this.heightAnimationProgress = 0

    this.timerScale = 0;  //from 0 to 1, variable used to make animations of showing/hiding
    this.timerCurrentAnimation = 1 // 0 - nothing, 1 - timing-out
    this.timerAnimationProgress = 0

    this.notification = document.createElement('div');
    this.fullHeight = 0;

    this.toDelete = false; // make true if this should be removed from array

    //constructor
    let _this = this;

    if(type!="success"&&type!="warning"&&type!="error")
        type = "info";

    this.notification.className = "page-notifications-body"+" page-notifications-"+this.theme+" page-notifications-"+this.type;
    this.notification.setAttribute('notificationid', this.pnId);
    this.notification.style.maxWidth = this.width+"px";

    let left = document.createElement('div');
    left.className = "page-notifications-left";

    if(type=="success") left.innerHTML = "&#10003";
    else if(type=="info") left.innerHTML = "i";
    else if(type=="warning") left.innerHTML = "!";
    else if(type=="error") left.innerHTML = "&#215;"

    let right = document.createElement('div');
    right.className = "page-notifications-right";

    let timer = document.createElement('div');
    timer.className = "page-notifications-timer";

    let closeButton = document.createElement('div');
    closeButton.className = "page-notifications-close";
    closeButton.innerHTML = "&#215";
    
    closeButton.onclick = function() {
       _this.close();
    }

    let h1 = document.createElement('h1');
    let h2 = document.createElement('h2');
    let h3 = document.createElement('h3');

    let date = new Date();

    h1.innerHTML = title;
    h2.innerHTML = content;
    let minutes = date.getMinutes();
    if(minutes <= 10) minutes = "0"+minutes;
    h3.innerHTML = date.getHours() + ":" + minutes;
    
    right.appendChild(h1);
    right.appendChild(closeButton);
    right.appendChild(h2);
    right.appendChild(timer);
    right.appendChild(h3);

    this.notification.appendChild(left);
    this.notification.appendChild(right);

    container.appendChild(this.notification);

    this.fullHeight = this.notification.offsetHeight;
    this.notification.style.height = "0px";

    this.close = function() {
        if(this.heightCurrentAnimation==0) {
            var notifications = container.getElementsByClassName('page-notifications-body');
            for(let notification of notifications) {
                if(notification.getAttribute('notificationId')==this.pnId) {
                    this.heightCurrentAnimation = 2;
                    this.heightAnimationProgress = 0;
                    setTimeout(function(){
                        _this.toDelete = true;
                        notification.parentNode.removeChild(notification);
                    },300);
                    return;
                }
            }        
        }
    }
    this.changeDuration = function(duration) {
        if(!isNaN(duration)) {
            this.duration = duration;
            this.timerAnimationProgress = 0;
            this.timerCurrentAnimation = 1;
        } else if(duration == 'unknown') {
            this.timerAnimationProgress = 0;
            this.duration = false;
            this.timerCurrentAnimation = 0;
            this.timerScale = 1;
        } else if(duration == false) {
            this.timerAnimationProgress = 0;
            this.duration = false;
            this.timerCurrentAnimation = 0;
            this.timerScale = 0;
        }
    }
    this.update = function(deltaTime) {
        //showing and hiding
        if(this.heightCurrentAnimation==1) {
            this.heightAnimationProgress += deltaTime
            if(this.heightAnimationProgress>= 300) this.heightAnimationProgress = 300;
            
            this.heightScale = this.easeOutQuint(this.heightAnimationProgress/300.0);
            if(this.heightAnimationProgress == 300) this.heightCurrentAnimation = 0;
        }
        else if(this.heightCurrentAnimation==2) {
            this.heightAnimationProgress += deltaTime
            if(this.heightAnimationProgress>= 300) this.heightAnimationProgress = 300;
            
            this.heightScale = 1-this.easeOutQuint(this.heightAnimationProgress/300.0);
            if(this.heightAnimationProgress == 300) this.heightCurrentAnimation = 0;
        }
        this.notification.style.marginTop = this.heightScale*10+"px";
        this.notification.style.height = this.heightScale*this.fullHeight+"px";
        //timer
        if(this.timerCurrentAnimation==1) {
            this.timerAnimationProgress += deltaTime
            if(this.timerAnimationProgress>= this.duration) this.timerAnimationProgress = this.duration;

            this.timerScale = 1-this.timerAnimationProgress/this.duration;
            if(this.timerAnimationProgress == this.duration) {
                this.close();
                this.timerCurrentAnimation = 0;
            }
        }
        this.notification.getElementsByClassName('page-notifications-timer')[0].style.width = this.timerScale*this.width+"px";
    }

    this.easeOutQuint = function(t) //source: https://gist.github.com/gre/1650294 
    { return 1+(--t)*t*t*t*t }

    if(!isNaN(duration)&&duration!=false) {
        let _this = this;

        this.notification.onmouseover = function() {
            _this.changeDuration('unknown');
        }
        this.notification.onmouseleave = function() {
            _this.changeDuration(duration);
        }
         _this.changeDuration(duration);

    } else {
        _this.changeDuration(false);
    } 

}