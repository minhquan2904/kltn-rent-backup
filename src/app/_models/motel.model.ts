export class Motel {
    constructor(
        public _id:         string,
        public title:       string,
        public category:    string,
        public customer:    string,
        public description: string,
        public price:       string,
        public area:        number,
        public city:        string,
        public district:    string,
        public street:      string,
        public ward:        string,
        public add:         string,
        public address:     string,
        public lat:         String,
        public lng:         String,
        public img:         String[],
        public rating:      Number,
        public expired:     Boolean,
        public contact:     string,
        public status:      number,
        public created_at:  Date
    ) {}
}
