

(function(){
    //

    var ctx = document.getElementById("chart");

    var data = {
        labels: [],
        datasets: [
            {
                label: "Ideal",
                fillColor: "rgba(55,220,10,0.5)",
                strokeColor: "rgba(55,220,10,0.8)",
                highlightFill: "rgba(55,220,10,0.75)",
                highlightStroke: "rgba(55,220,10,1)",
                data: []
            },
            {
                label: "Real",
                fillColor: "rgba(151,187,205,0.5)",
                strokeColor: "rgba(151,187,205,0.8)",
                highlightFill: "rgba(151,187,205,0.75)",
                highlightStroke: "rgba(151,187,205,1)",
                data: [10, 20, 30, 20, 10, 20, 30, 20, 10, 20, 30, 10]
            }
        ]
    };


    const allTasksFetched = function(tasks){
        console.info('Fetched all tasks', tasks);

        tasks = window.scrum.proceedTasks(tasks);

        const from = Cookies.get('scrum_startdate');
        const to = Cookies.get('scrum_enddate');

        data.labels = window.scrum.getArrOfLabels(from, to);
        data.datasets[1].data = window.scrum.getDataReal(from, to, tasks);
        data.datasets[0].data = window.scrum.getDataIdeal(from, to);

        new Chart(ctx, {
            type: 'line',
            data: data
        });

    };

    const getTasksDetails = function(taskIds){
        const allTasksLength = taskIds.length;
        var i = 0;
        const tasks = { areDone: [], areNotDone: [] };

        taskIds.forEach(function(taskId){
            asanaRequest('tasks/'+taskId, function(res) {
                i++;
                if (res.data.completed) { tasks.areDone.push(res.data) } else { tasks.areNotDone.push(res.data) }
                if (i === allTasksLength){ allTasksFetched(tasks) }
            });
        });
    };

    const loadGraph = function(e){
        const selectedProject = $('#graph-input').val();
        Cookies.set('scrum_project', selectedProject);
        console.info('Loading Graph And Set Cookie To:', selectedProject);

        asanaRequest('projects/'+selectedProject, function(res) {
            console.info('Got Scrum Due Date of the project:', res.data.due_date);
            Cookies.set('scrum_duedata', res.data.due_date);
        });

        asanaRequest('projects/'+selectedProject+'/tasks?opt_fields=id&limit=100', function(res) {
            const data = [];
            res.data.forEach(function(x){ data.push(x.id) });
            getTasksDetails(data)
        });

    };

    var $tokenField = $('#graph-input');
    var currentProjectInCookies = Cookies.get('scrum_project');
    if (currentProjectInCookies){ $tokenField.val(currentProjectInCookies) }

    $('#graph-submit').on('click', loadGraph);
})();
