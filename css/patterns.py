# Alphabhet Rangoli

def print_rangoli(size):
    main_str = ["a"]
    w = size*4 -3
    h = size*2-1
    for i in range(size-1):
        curr_letter = chr(98+i)
        main_str.insert(0, curr_letter)
        main_str.append(curr_letter)
    for i in range(h):
        if i == 0 or i == h-1:
            curr_str = main_str[0]
        else:
            if i > int(h/2):
                i = h-i-1
            curr_str = '-'.join(main_str[0:i+1]) + '-' + '-'.join(main_str[-i:])
        print(curr_str.center(w,'-'))

if __name__ == '__main__':
    for n in range(10):
        print_rangoli(n+1)
        print()




# Octa-Hexa table

# def print_formatted(number):
#     max_len = len(str(bin(number).lstrip("0b")))
#     for i in range(number):
#         i += 1
#         vals = []   
#         vals.append(str(i).rjust(max_len, " "))
#         vals.append(str(oct(i)).lstrip("0o").rjust(max_len, " "))
#         vals.append(str(hex(i)).lstrip("0x").upper().rjust(max_len, " "))
#         vals.append(str(bin(i)).lstrip("0b").rjust(max_len, " "))
        
#         print(" ".join(vals))
#     # your code goes here

# if __name__ == '__main__':
#     n = int(input())
#     print_formatted(n)




# Designer Door mat

# d1 = int(input())
# dimensions = (d1, d1*3)
# for i in range(int((dimensions[0]-1)/2)):
#     p = '.|.'*(2*i+1)
#     print(p.center(dimensions[1], "-"))
# print("WELCOME".center(dimensions[1], "-"))
# for i in range(int((dimensions[0]-1)/2)):
#     i = int((dimensions[0]-1)/2)-i-1
#     p = '.|.'*(2*i+1)
#     print(p.center(dimensions[1], "-"))