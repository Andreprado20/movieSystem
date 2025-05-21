#!/usr/bin/env python
import os
from pathlib import Path

def setup_test_directories():
    """
    Create necessary directories for test execution and results
    """
    # Get the test directory path
    test_dir = Path(__file__).parent.absolute()
    
    # Create results directory
    results_dir = test_dir / "results"
    results_dir.mkdir(exist_ok=True)
    
    # Create cache directory
    cache_dir = results_dir / "cache"
    cache_dir.mkdir(exist_ok=True)
    
    print(f"Test directories created:")
    print(f"  - Results: {results_dir}")
    print(f"  - Cache: {cache_dir}")
    
    # Create .gitignore to exclude results from version control
    gitignore_path = results_dir / ".gitignore"
    if not gitignore_path.exists():
        with open(gitignore_path, 'w') as f:
            f.write("*\n!.gitignore\n")
        print("Created .gitignore in results directory")

if __name__ == "__main__":
    setup_test_directories() 