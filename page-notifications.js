function PageNotifications(args = {}) {
    //constructor

    if(args.theme=="dark")
        this.theme = "dark";
    else 
        this.theme = "light";

    if(args.parentDiv&&document.getElementById(args.parentDiv)) {
        this.parentDiv = document.getElementById(args.parentDiv);
    } else {
        this.parentDiv = document.body;
    }
    

    this.lastNotificationIdNumber = 0;

    this.notificationsDurationsTimers = {};
    this.notificationsDurationsTimeouts = {};
    this.notificationsDurationsLoop = null;

    this.deltaLastUpdate =  Date.now();

    

    this.container = document.createElement('div');
    this.container.id = 'page-notifications-container';
    this.parentDiv.appendChild(this.container);

    this.notificationsDurationsLoop = setInterval(function() {
        var now = Date.now();
        var deltaTime = now-this.deltaLastUpdate;
        this.deltaLastUpdate = now;

        for(var notificationId in this.notificationsDurationsTimers) {
            this.notificationsDurationsTimers[notificationId] -= deltaTime;
            if(this.notificationsDurationsTimers[notificationId]<=0) {
                this.close(notificationId);
                delete this.notificationsDurationsTimers[notificationId];
            }
        }
        
    }.bind(this),50);

    this.push = function(title,content,type,duration) {
        //validation
        if(type!="success"&&type!="warning"&&type!="error")
            type = "info";

        this.lastNotificationIdNumber++;
        var notificationId = "pn"+this.lastNotificationIdNumber;

        let notification = document.createElement('div');
        notification.className = 
        "page-notifications-body"+
        " page-notifications-"+this.theme+
        " page-notifications-"+type;

        notification.setAttribute('notificationid', notificationId);

        let left = document.createElement('div');
        left.className = "page-notifications-left";

        if(type=="success") left.innerHTML = "&#10003";
        else if(type=="info") left.innerHTML = "&#9432;";
        else if(type=="warning") left.innerHTML = "&#9888;";
        else if(type=="error") left.innerHTML = "&#215;"


        let right = document.createElement('div');
        right.className = "page-notifications-right";

        let timer = document.createElement('div');
        timer.className = "page-notifications-timer";

        let closeButton = document.createElement('div');
        closeButton.className = "page-notifications-close";
        closeButton.innerHTML = "&#215";

        let _this = this;
        closeButton.onclick = function() {
            _this.close(notificationId);
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

        notification.appendChild(left);
        notification.appendChild(right);

        this.container.appendChild(notification);

        notification.setAttribute("closing","false")
        notification.style.height = notification.offsetHeight;
        notification.style.animationName = "notification-showup"

        if(!isNaN(duration)&&duration!=false) {
            notification.onmouseover = function() {
                _this.changeDuration(notificationId,'unknown');
            }
            notification.onmouseleave = function() {
                _this.changeDuration(notificationId,duration);
            }
            _this.changeDuration(notificationId,duration);
        } else {
            _this.changeDuration(notificationId,'unknown');
        } 
    }   
    this.changeDuration = function(notificationId,duration) {
        if(!isNaN(duration)) {
            this.notificationsDurationsTimers[notificationId] = duration;
            var notifications = this.container.getElementsByClassName('page-notifications-body');
            
            for(let notification of notifications) {
                if(notification.getAttribute('notificationId')==notificationId) {
                    
                    notification.getElementsByClassName('page-notifications-timer')[0].style.animationName = "";
                    setTimeout(function(){
                        notification.getElementsByClassName('page-notifications-timer')[0].style.width = "330px";
                        notification.getElementsByClassName('page-notifications-timer')[0].style.animationDuration = duration/1000.0+"s";
                        notification.getElementsByClassName('page-notifications-timer')[0].style.animationName = "notification-timer-animation";
                    },0)
                    this.notificationsDurationsTimeouts[notificationId] = setTimeout(function(){
                        notification.getElementsByClassName('page-notifications-timer')[0].style.width = "0px";
                    },duration)
                }
            }

        } else {
            this.notificationsDurationsTimers[notificationId] = "unknown";
            var notifications = this.container.getElementsByClassName('page-notifications-body');
            
            for(let notification of notifications) {
                if(notification.getAttribute('notificationId')==notificationId) {

                    notification.getElementsByClassName('page-notifications-timer')[0].style.animationName = "";
                    clearTimeout(this.notificationsDurationsTimeouts[notificationId]);
                    setTimeout(function(){
                        notification.getElementsByClassName('page-notifications-timer')[0].style.width = "330px";
                        notification.getElementsByClassName('page-notifications-timer')[0].style.opacity = "0"

                    },0)
                }
            }

        }
    }
    this.close = function(notificationId) {
        var notifications = this.container.getElementsByClassName('page-notifications-body');
        for(let notification of notifications) {
            if(notification.getAttribute("closing")=="false") {
                if(notification.getAttribute('notificationId')==notificationId) {
                    notification.style.animationName = "notification-hide"
                    notification.setAttribute("closing","true")
                    setTimeout(function(){
                        if(notification)
                        notification.parentNode.removeChild(notification);
                    },300);
                    return;
                }
            }
        }
    }
    this.closeAll = function(){
        for(let notificationId in this.notificationsDurationsTimers) {
            this.close(notificationId);
        }
    }
}