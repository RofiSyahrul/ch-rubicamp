class CarFactory {
    constructor(minCarNums, maxCarNums){
        // set number of cars to be manufactured
        this.numOfCars = CarFactory.randInt(minCarNums,maxCarNums,true);
        // retrieve all blue prints for each brand
        const brandsBluePrint = {Ferrari, BMW, Lamborghini, Toyota};
        const brands = Object.keys(brandsBluePrint);
        this.cars = {}; // initialize manufactured car(s)
        for (let i=1; i<=this.numOfCars; i++){
            // get random brand
            let brand = brands[CarFactory.randInt(brands.length)];
            // create instance of that random brand
            this.cars[`car_${i}`] = new brandsBluePrint[brand]();
        }
    }
    simulateWarranties(){
        console.log(`Result of Simulating Warranties for ${Object.keys(this.cars).length} Car(s)\n`);
        for (let car_id in this.cars){
            // add ages to this.cars[car_id]
            this.cars[car_id].addAges(CarFactory.randInt(1,5));
            // compute remaining warranty
            const remainingWarranty = this.cars[car_id].warranty - this.cars[car_id].year_manufacturing - this.cars[car_id].age;
            console.log(
        `${car_id}:  ${this.cars[car_id].brand} - ${this.cars[car_id].model}.
        Manufactured: ${this.cars[car_id].year_manufacturing}.
        Warranty: ${this.cars[car_id].warranty}.
        Age: ${this.cars[car_id].age} year(s) old.
        Remaining warranty: ${remainingWarranty} year(s).
        Tyre: ${JSON.stringify(this.cars[car_id].tyre)}.
        ${this.cars[car_id].seat} seats, ${this.cars[car_id].door} doors.
        `
            );
        }

    }
    static randInt(min=0,max=1,includeMax=false) {
        if (arguments.length==1){
            min = 0;
            max = arguments[0];
        }
        if (includeMax) return Math.floor(Math.random()*(max+1-min)+min);
        return Math.floor(Math.random()*(max-min)+min);
    }
    static get year(){
        const date = new Date();
        return date.getYear()+1900;
    }
}

class Car {
    constructor(){
        const numOfSeats = [4,5,6,7]; // source: https://www.quora.com/How-many-people-can-typically-sit-in-a-car
        const numOfDoors = [2,4,5]; //  source: https://www.carfolio.com/
        this.tyre = new Tyre();
        this.seat = numOfSeats[CarFactory.randInt(numOfSeats.length)];
        this.door = numOfDoors[CarFactory.randInt(numOfDoors.length)];
        this.year_manufacturing = CarFactory.year;
        this.warranty = this.year_manufacturing + CarFactory.randInt(5,10,true);
        this.age = 0;
    }
    addAges(n){
        if (n>0) this.age += n;
    }
}

class Tyre {
    constructor(){
        // set duty and type of Tyre
        // content source: https://en.wikipedia.org/wiki/Tire
        const dutiesAndTypes = {
            light_medium: [
                'winter', 'all-season', 'all-terrain', 'mud-terrain',
                'high-performance'
            ],
            heavy: ['truck', 'off road']
        };
        const duties = Object.keys(dutiesAndTypes);
        this.duty = duties[CarFactory.randInt(duties.length)];
        const types = dutiesAndTypes[this.duty];
        this.duty = this.duty.split('_').join('-');
        this.type = types[CarFactory.randInt(types.length)];
        // set size of Tyre
        // content source: https://www.uniroyal-tyres.com/car/tyre-guide/tyre-knowledge/what-does-tyre-size-mean
        const speeds = [...Array(11).keys()].map(x=>{
            if (x>=8) return 30*x;
            return 140+10*x
        });
        this.cross_section_width = `${2*CarFactory.randInt(10)+181} mm`;
        this.aspect_ratio = `${45+5*CarFactory.randInt(5)}%`;
        this.construction_type = 'radial';
        this.rim_diameter = `${CarFactory.randInt(14,18)} inch`;
        this.load_index = CarFactory.randInt(62,127);
        this.maximum_speed = `${speeds[CarFactory.randInt(speeds.length)]} km/hour`;
    }
}

class Ferrari extends Car {
    constructor(){
        // https://en.wikipedia.org/wiki/Ferrari
        super();
        const models = ['GTC4Lusso', 'F8 Tributo', 'Portofino', '812 Superfast','SF90 Stradale'];
        this.brand = this.constructor.name;
        this.model = models[CarFactory.randInt(models.length)];
    }
}
class BMW extends Car {
    constructor(){
        // https://en.wikipedia.org/wiki/BMW
        super();
        const models = ['F40', 'F22', 'G20', 'F33', 'G30', 'G32', 'G12', 'G15'];
        this.brand = this.constructor.name;
        this.model = models[CarFactory.randInt(models.length)];
    }
}
class Lamborghini extends Car{
    constructor(){
        // https://en.wikipedia.org/wiki/List_of_Lamborghini_automobiles
        super();
        const models = ['Aventador', 'Huracan', 'Urus'];
        this.brand = this.constructor.name;
        this.model = models[CarFactory.randInt(models.length)];
    }
}
class Toyota extends Car{
    constructor(){
        // https://en.wikipedia.org/wiki/List_of_Toyota_vehicles
        super();
        const models = ['Alphard', 'Corolla', 'Avanza', 'Agya', 'Innova', 'Sienna'];
        this.brand = this.constructor.name;
        this.model = models[CarFactory.randInt(models.length)];
    }
}

const factory = new CarFactory(1,10);
factory.simulateWarranties();