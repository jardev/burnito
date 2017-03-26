(function(){

    window.scrum = window.scrum || {};

    window.scrum.proceedTasks = function(tasks){
        const customTasks = {};

        customTasks.finished = tasks.areDone.map(function(task){
            return {
                finishedInDayOfYear: moment(task.completed_at).dayOfYear(),
                points: task.custom_fields.filter(function(x){ return x.name === "Estimate" })[0].number_value
            }
        });

        var sum = 0;
        tasks.areNotDone.map(function(task){
            return task.custom_fields.filter(function(x){ return x.name === "Estimate" })[0].number_value
        }).forEach(function(x){ sum += x });

        customTasks.unfinished = sum;
        return customTasks
    };

    window.scrum.getArrOfLabels = function(from, to){
        const range = parseInt(to, 10) - parseInt(from, 10);
        const result = [];

        for (var i=0; i<=range; i++){
            const dateInYear = parseInt(from, 10) + i;
            result.push(moment().dayOfYear(dateInYear).format("DD/MM"));
        }

        return result
    };

    window.scrum.getDataIdeal = function(from, to){
        const range = parseInt(to, 10) - parseInt(from, 10);
        const step = 100 / range;
        var together = 0;
        const result = [];

        for (var i=0; i<=range; i++){
            result.push(Math.round(together));
            together += step;
        }

        return result.reverse();
    };

    window.scrum.getDataReal = function(from, to, tasks){
        const finished = tasks.finished;
        const unfinished = tasks.unfinished;
        const dateRange = {};
        var all = unfinished;

        finished.forEach(function(task){
            if (dateRange[task.finishedInDayOfYear] === undefined) {
                dateRange[task.finishedInDayOfYear] = 0;
            }
            dateRange[task.finishedInDayOfYear] += task.points;
            all += task.points
        });

        const together = parseInt(all, 10);

        const range = parseInt(to, 10) - parseInt(from, 10);
        var finalRange = [];

        for (var i=0; i<=range; i++){ // iterate the date range
            const current = i + parseInt(from, 10); // current day in year

            if (dateRange[current] !== undefined){
                all -= dateRange[current]
            }
            finalRange.push(all);
        }

        // move this to percentage from 0% to 100%
        finalRange = finalRange.map(function(x){
            return x / together * 100
        });

        return finalRange;
    };

})();
