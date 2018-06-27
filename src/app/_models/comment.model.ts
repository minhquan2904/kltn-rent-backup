export class Comment {
    constructor(
        public _id:             string,
        public customer_id:     string,
        public customer_name:   string,
        public customer_level:  Number,
        public content:         string,
        public status:          number,
        public motel_id:        string,
        public created_at:      Date
    ) {}
}
