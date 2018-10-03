/** Models a User object */
export class User {
    _id: string;
    username?: string;
    password?: string;
    name?: string;
    email?: string;
    github?: {
        id: string,
        token: string
    };
    isSiteAdmin?: boolean;
    following?: string[];
}

/** Models a Markdown object */
export class Markdown {
    _id?: string;
    content: string;
    editedBy?: string;
    editedOn?: string;
}

/** Models a Project object */
export class Project {
    _id?: string;
    name: string;
    markdown: string;
    fileName: string;
    description?: string;
    members?: (User | string)[];
    admins?: (User | string)[];
    gitRepo?: string;
}

/** Models a activity feed item */
export class Activity {
    _id?: string;
    actor: string;
    title: string;
    createdOn?: string;
}
