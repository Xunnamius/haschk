# DNSCHK
A zero-cost (in theory) layer insied of DNS built to check the authenticity of downloadable files on the web.

# Plugin
The preposed system will manifest as a simple web browser plugin. It is primarily written in Rust, HTML, CSS, and Node. We have opted to write the majority of the plugin as a Rust native plugin for Node, simple because of Rust's increased speed and access to low-level operations.