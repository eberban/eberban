#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        assert_eq!(2 + 2, 4);
    }
}

pub mod dict {
    use std::collections::BTreeMap;
    use std::{fs::File,io::BufReader};

    #[derive(Debug, serde::Serialize, serde::Deserialize)]
    pub struct Entry {
        #[serde(rename = "_family")]
        pub family: String,

        #[serde(rename = "_signature")]
        pub signature: Option<String>,

        #[serde(rename = "eng_short")]
        pub english_short: String,

        #[serde(rename = "eng_long")]
        pub english_long: String,

        #[serde(rename = "jbo_similar")]
        pub lojban_similar: Option<String>,
    }

    pub type Dictionary = BTreeMap<String, Entry>;

    pub fn from_file(file: File) -> Result<Dictionary, serde_yaml::Error> {
        let reader = BufReader::new(file);
        return serde_yaml::from_reader(reader);
    }
}

pub mod cli {
    use std::io::{self, BufRead};
    use super::dict::Dictionary;

    pub fn run_interactive_dictionary(dict: Dictionary) {
        let stdin = io::stdin();

        // TODO: [jqueiroz] search based on "english_short" and "lojban_similar" as well
        for line in stdin.lock().lines() {
            match dict.get(&line.unwrap()) {
                None => println!("=> not found"),
                Some(entry) => {
                    // TODO: [jqueiroz] properly format the output
                    println!("=> {:?}", entry)
                }
            }
        }
    }
}
