#!/usr/bin/env python
import os
import sys
import subprocess
import time
import argparse
from pathlib import Path
from datetime import datetime

def main():
    parser = argparse.ArgumentParser(description="Run MovieSystem API tests with benchmarking")
    parser.add_argument(
        "--module", "-m", 
        help="Specific test module to run (e.g., 'test_users')"
    )
    parser.add_argument(
        "--verbose", "-v", 
        action="store_true", 
        help="Show verbose output"
    )
    parser.add_argument(
        "--html", 
        action="store_true", 
        help="Generate HTML report"
    )
    parser.add_argument(
        "--junit", 
        action="store_true", 
        help="Generate JUnit XML report for CI"
    )
    parser.add_argument(
        "--coverage", 
        action="store_true", 
        help="Generate coverage report"
    )
    
    args = parser.parse_args()
    
    # Ensure we're in the test directory
    test_dir = Path(__file__).parent
    os.chdir(test_dir)
    
    # Prepare output directory
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_dir = test_dir / "results" / timestamp
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Build the pytest command
    cmd = ["pytest"]
    
    # Verbose flag
    if args.verbose:
        cmd.append("-v")
    
    # Specific module
    if args.module:
        cmd.append(f"{args.module}.py")
    
    # HTML report
    if args.html:
        cmd.extend(["--html", str(output_dir / "report.html"), "--self-contained-html"])
    
    # JUnit XML
    if args.junit:
        cmd.extend(["--junitxml", str(output_dir / "results.xml")])
    
    # Coverage
    if args.coverage:
        cmd = ["coverage", "run", "-m"] + cmd
    
    # Add output directory to command
    cmd.extend(["-o", f"cache_dir={output_dir / 'cache'}"])
    
    # Display command
    cmd_str = " ".join(cmd)
    print(f"Running: {cmd_str}")
    
    # Measure execution time
    start_time = time.time()
    
    # Run the tests
    result = subprocess.run(cmd)
    
    # Calculate execution time
    execution_time = time.time() - start_time
    print(f"\nExecution completed in {execution_time:.2f} seconds")
    
    # Generate coverage report if requested
    if args.coverage:
        print("\nGenerating coverage report...")
        subprocess.run(["coverage", "html", "-d", str(output_dir / "coverage")])
        subprocess.run(["coverage", "report"])
    
    # Print location of output files
    print(f"\nTest results saved to: {output_dir}")
    
    return result.returncode

if __name__ == "__main__":
    sys.exit(main()) 