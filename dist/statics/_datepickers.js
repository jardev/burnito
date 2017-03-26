(function(){

    const from = Cookies.get('scrum_startdate');
    const to = Cookies.get('scrum_enddate');

    if (from){
        $('#startdate').val(moment().dayOfYear(from).format("YYYY-MM-DD"));
    }

    if (to){
        $('#enddate').val(moment().dayOfYear(to).format("YYYY-MM-DD"));
    }

    const saveDates = function(){
        Cookies.set(
            'scrum_startdate',
            moment($('#startdate').val()).dayOfYear()
        );

        Cookies.set(
            'scrum_enddate',
            moment($('#enddate').val()).dayOfYear()
        );
    };

    $('#startdate, #enddate').on('change', saveDates);

})();
