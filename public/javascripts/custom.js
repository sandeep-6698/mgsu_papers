var x = false;
// Prevent dropdown menu from closing when click inside the form
$(document).on("click", ".navbar-right .dropdown-menu", function (e) {
	e.stopPropagation();
});

//alter image
function altImg(img) {
	img.src = "images/default.png";
	img.onerror = "";
	return true;
}

//badge value for pending paper
// $(document).ready(function (){
// setInterval(function(){
// 	$.get(`${ROOT}download/pandingPaper`,
// 			function(data,status){
// 				console.log(data);
// 				//$('.pandingPaper').append(data);
// 			}
// 		)
// },2000);
// })

//sign up panel tadio button styling
$(document).ready(function () {
	$(document).on("click", 'input[name="status"]', function (e) {
		if ($(this).val() == 1) {
			$('#active').css('color', "blue");
			$('#inactive').css('color', "gray")
		}
		else {
			$('#active').css('color', "gray");
			$('#inactive').css('color', "blue");
		}
	});
})

//add new courses form input
$(document).ready(function () {
	var count = 1;
	$(document).on('click', '#addNewCourseBtn', function () {
		$('.course').append(`
<div>
<hr>
<div class="form-group">
	<input type="text" name="course[${count}]" class="form-control" placeholder="Enter Course Name">
</div>
<div class="row">
	<div class="col-xs-4">
		<span>Yearly</span>
		<label class="switch">
			<input type="checkbox" name="course[${count}]" id="yearly" value="1" class="yearly">
			<span class="slider round"></span>
		</label>
	</div>
	<div class="col-xs-8">
		<input type="number" name="course[${count}]" class="form-control" id="num_year_sem"
			placeholder="">
	</div>
</div>
<a href="#" class="remove btn pull-right text-danger" >Delete</a>
</div>
	
	`)
		count++;
		return false;
	});

	//delete courses form input
	$(document).on('click', '.remove', function () {
		$(this).parent('div').remove();
		return false;
	})
})

function addSub(data) {
	$(data).parent('div').parent('div').parent('div').append(`<input type="text" name="sub[${data.name}]" class="form-control"><input type="text" name="sub[${data.name}]" class="form-control">`);
}

//upload page
$(document).ready(function () {

	//get Courses
	$(document).on('click', '.dep_id', function () {
		$.ajax({
			url: `${ROOT}upload/getCourse`,
			type: 'post',
			data: { dep_id: $(this).val() },
			success: function (res) {
				$('#course_name').html(res);
				$('#sem').html(`<option disabled selected>Choose Semester or Year</option>`);
				$('#sub_name').html(`<option disabled selected>Choose Subject</option>`);
			}
		})
	})

	//get Semester
	$(document).on('click', '.course_id', function () {
		$.ajax({
			url: `${ROOT}upload/getSem`,
			type: 'post',
			data: { course_id: $(this).val() },
			success: function (res) {
				$('#sem').html(res);
				$('#sub_name').html(`<option disabled selected>Choose Subject</option>`);
			}
		})
	})

	//get Subjects
	$(document).on('click', '.sem', function () {
		var course_id = $('.course_id').val();
		$.ajax({
			url: `${ROOT}upload/getSub`,
			type: 'post',
			data: { sem: $(this).val(), course_id: course_id },
			success: function (res) {
				$('#sub_name').html(res);
			}
		})
	})

	//new user password validation
	$(document).on('click change keyup', '.confirmPassword', function () {
		let pass = $('.password').val();
		let confirmPass = $(this).val();
		if(pass != confirmPass)
		{
			$('.confirmMsg').html("Password does not matched!");
			x=false;
		}
		else
		{
			$('.confirmMsg').html("");
			x=true;
		}
	})

})

//update user passwordd validdation
function validatePass(pass,confirmPass)
{
		if(pass != confirmPass)
		{
			$('.confirmMsg').html("Password does not matched!");
			x=false;
		}
		else
		{
			$('.confirmMsg').html("");
			x=true;
		}
}
function submitForm()
	{
		return x;
	}
function confirmDel()
{
	if(confirm("After deleted you can not recover this data!"))
	{
		return true;
	}
	return false;
}
function confirmDelDep()
{
	if(confirm("Delete Department, Courses, Subjects and Papers!"))
	{
		return confirmDel();
	}
	return false;
}
function confirmDelCourse()
{
	if(confirm("Delete Courses, Subjects and Papers!"))
	{
		return confirmDel();
	}
	return false;
}
function confirmDelSub()
{
	if(confirm("Delete Subjects and Papers!"))
	{
		return confirmDel();
	}
	return false;
}