var asanaRequest = function(path, callback){
    const token = Cookies.get('scrum_token');
    const api = 'https://app.asana.com/api/1.0/';

    const auth = function(xhr) {
        xhr.setRequestHeader('Authorization','Bearer ' + token);
        xhr.setRequestHeader('accept','application/json')
    };

    $.ajax({
        url: api + path,
        success: callback,
        beforeSend: auth,
        error: function(){ alert('Error! Maybe a wrong token?!\n\n') }
    });
};


(function(){
    // TOKEN HANDLING and the input

    // adam's token '0/3de7b0cb6c27b5a2841f23d1cf8a65c9';

    var $tokenSubmit = $('#token-submit');
    var $tokenField = $('#token');
    var currentToken = Cookies.get('scrum_token');

    if (currentToken){ $tokenField.val(currentToken) }

    $tokenSubmit.on('click', function() {
        var value = $tokenField.val();
        Cookies.set('scrum_token', value);
        $tokenField.val(value);
        console.info('Change Token:', currentToken)
    });

    console.info('Current Token In Cookie:', currentToken)
})();

(function(){
    // LOAD APPLICATION after clicking on the button LOAD ASANA

    const loadApp = function(){
        console.info('Loading Asana App');

        asanaRequest('workspaces?opt_fields=id,name,is_organization&limit=100', function(res){
            var $workspaces = $('#workspaces select');

            $.each(res.data, function(i, x) {
                $workspaces.append($("<option />").val(x.id).text(x.name));
            });

            console.log("Fetched Workspaces Data:", res.data);
            $('#workspaces').fadeIn()
        });

    };

    $('#load-app').on('click', loadApp);
})();


(function(){
    // Choose Project based on workspace

    const selectedWorkspace = function(){
        const $projectsSelect =  $('#projects select');
        const projectId = $('#workspaces select').val();

        asanaRequest('projects?opt_fields=workspace,name,id&limit=100&workspace=' + projectId + '&archived=false', function(res) {
            console.info('Fetched projects for the selected workspace:', res);

            $projectsSelect.find('option').remove().end();

            $.each(res.data, function(i, x) {
                $projectsSelect.append($("<option />").val(x.id).text(x.name));
            });

            $('#projects').fadeIn();
        });
    };

    $('#workspaces select').on('change', selectedWorkspace);
})();


(function(){
    // on every change set cookie and set the right column value

    const selectedProject = function(){
        const selectedProject = $('#projects select').val();
        $('#graph-input').val(selectedProject);
        Cookies.set('scrum_project', selectedProject);
        console.info('Was Selected Project And Set To Cookies:', selectedProject);
    };

    $('#projects select').on('change', selectedProject);
})();


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
