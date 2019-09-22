clang-tidy
==========

[GitHub Action](https://github.com/features/actions) for running the
[clang-tidy](https://clang.llvm.org/extra/clang-tidy/) tool over source files.

License
-------

MIT License, see [LICENSE](https://github.com/potatoengine/ghactions/blob/master/clang-tidy/LICENSE)
for details.

Usage Example
-------------

```yaml
jobs:
  publish:
    - uses: actions/checkout@master
    - run: mkdir -p build && cd build && cmake -DCMAKE_EXPORT_COMPILE_COMMANDS=ON ..
    - uses: potatoengine/ghactions/clang-tidy@master
      with:
        build_path: build
        include: *.cpp;*.c
        exclude: *test*
```
