class Employee{
    constructor(name,salary,tax){
        this.name = name;
        this.salary = salary;
        this.tax = tax;
    }

    calcSalary(){
        this.inHandSalary = Math.round(this.salary - ((this.tax/100)*this.salary));
        return this.inHandSalary;
    }

    generateId(){
        this.id = Math.floor(Math.random()*10000);
        return this.id;
    }
}

class EmployeeUI{
    addEmployee(employee){
        const employeeList = document.querySelector('tbody');

        const markup = `<tr>
        <th scope="row">${employee.id}</th>
        <th>${employee.name}</th>
        <th>${employee.salary}</th>
        <th>${employee.tax}</th>
        <th>$${employee.inHandSalary}</th>
        <th><a href="#" class="btn btn-danger delete">Delete</th>
    </tr>`;

    employeeList.insertAdjacentHTML('afterbegin',markup);

    }

    clearField(){
        document.querySelector('#nameField').value='';
        document.querySelector('#salaryField').value='';
        document.querySelector('#taxField').value='';
    }

    messageAlert(messageType , message){
        const markup = `<div class="alert alert-${messageType}" role="alert">${message}</div>`;
        const form = document.querySelector('form');
        form.insertAdjacentHTML('beforebegin',markup);

        setTimeout(()=>{
            document.querySelector('.alert').remove();
        },2000);
    }

    deleteEmployee(target){
        if(target.matches('.delete')){
            target.parentElement.parentElement.remove();
            return true;
        }
    }
}

class StoreEmployee{
    static getEmployees(){
        let employees;

        if(localStorage.getItem('employees')===null){
            employees = [];
        }else{
            employees = JSON.parse(localStorage.getItem('employees'));
        }
        return employees;
    }
    static addEmployees(employee){
        const employees = StoreEmployee.getEmployees();
        employees.push(employee);

        localStorage.setItem('employees' , JSON.stringify(employees));
    }

    static displayEmployees(){
        const employees = StoreEmployee.getEmployees();
        const employeeUI = new EmployeeUI();
        employees.forEach(employee => {
            employeeUI.addEmployee(employee);
        });
    }

    static removeEmployee(id){
        const employees = StoreEmployee.getEmployees();

        employees.forEach((employee,index)=>{
            if(employee.id === parseInt(id)){
                employees.splice(index,1);
            }
        });

        localStorage.setItem('employees' , JSON.stringify(employees));
    }
}

const addEmployeeButton = document.querySelector('#add_employee');
addEmployeeButton.addEventListener('click', e=>{
    const name = document.querySelector('#nameField').value;
    const salary = document.querySelector('#salaryField').value;
    const tax = document.querySelector('#taxField').value;

    const employeeUI = new EmployeeUI();

    if(name === ""|| salary === ""|| tax === ""){
        employeeUI.messageAlert('danger','Please complete the form before adding the employee');
    }else{
        const employee = new Employee(name,salary,tax);

        //assign random id to employee
        employee.id = employee.generateId();
        employee.inHandSalary = employee.calcSalary();

        employeeUI.addEmployee(employee);

        StoreEmployee.addEmployees(employee);

        employeeUI.messageAlert('success','Employee is added successfuly');
        employeeUI.clearField(); 
    }
});

document.querySelector('tbody').addEventListener('click',e => {
    const employeeUI = new EmployeeUI();
    const isDeleted = employeeUI.deleteEmployee(e.target);

    StoreEmployee.removeEmployee(e.target.parentElement.parentElement.firstElementChild.textContent);

    if(isDeleted){
        employeeUI.messageAlert('success','Employee deleted successfully!');
    }
});

document.querySelector('form').addEventListener('submit',e =>{
    e.preventDefault();
});

StoreEmployee.displayEmployees();