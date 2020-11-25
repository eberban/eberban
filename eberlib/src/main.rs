use std::fs::File;
use std::path::PathBuf;
use structopt::StructOpt;

#[derive(StructOpt, Debug)]
#[structopt(about = "the official eberban command-line utilities")]
enum Opt {
    Glosser {
        /// Dictionary filename
        #[structopt(short, long, parse(from_os_str))]
        dictionary_filename: PathBuf,
    },
}

fn main() {
    let opt = Opt::from_args();

    match opt {
        Opt::Glosser { dictionary_filename } => {
            let file = File::open(&dictionary_filename).unwrap_or_else(|error| {
                panic!("Unable to open dictionary file {:?} -- {:?}", dictionary_filename, error);
            });
            let dictionary = eberlib::dict::from_file(file).unwrap_or_else(|error| {
                panic!("Unable to parse dictionary contents -- {:?}", error);
            });
            eberlib::cli::run_interactive_dictionary(dictionary);
        }
    };
}
